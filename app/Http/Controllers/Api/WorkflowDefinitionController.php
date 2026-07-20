<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\TranslateWorkflowConditionRequest;
use App\Http\Traits\ApiResponse;
use App\Models\WorkflowDefinition;
use App\Services\AnthropicConditionTranslator;
use App\Services\WorkflowCatalog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use RuntimeException;
use SolutionForest\WorkflowEngine\Core\WorkflowEngine;
use Throwable;

class WorkflowDefinitionController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected WorkflowEngine $engine,
        protected AnthropicConditionTranslator $conditionTranslator,
    ) {}

    public function catalog(): JsonResponse
    {
        return $this->sendOk([
            'actions' => WorkflowCatalog::actions(),
        ]);
    }

    public function translateCondition(TranslateWorkflowConditionRequest $request): JsonResponse
    {
        try {
            $condition = $this->conditionTranslator->translate(
                $request->validated('natural_language'),
            );
        } catch (RuntimeException $e) {
            return $this->sendError(503, 'AI_TRANSLATION_UNAVAILABLE', $e->getMessage());
        } catch (Throwable $e) {
            return $this->sendError(503, 'AI_TRANSLATION_UNAVAILABLE', 'Failed to translate condition.');
        }

        return $this->sendOk([
            'condition' => $condition,
        ]);
    }

    public function index(Request $request): JsonResponse
    {
        $page = (int) $request->input('page', 1);
        $limit = (int) $request->input('limit', 20);
        $q = $request->input('q');

        $query = WorkflowDefinition::query()->orderByDesc('updated_at');

        if ($q) {
            $query->where(function ($builder) use ($q) {
                $builder->where('name', 'like', "%{$q}%")
                    ->orWhere('slug', 'like', "%{$q}%")
                    ->orWhere('description', 'like', "%{$q}%");
            });
        }

        if ($request->has('is_active')) {
            $query->where('is_active', filter_var($request->input('is_active'), FILTER_VALIDATE_BOOLEAN));
        }

        $total = $query->count();
        $rows = $query->skip(($page - 1) * $limit)->take($limit)->get();

        return $this->sendOk($rows, [
            'page' => $page,
            'limit' => $limit,
            'total' => $total,
            'totalPages' => (int) ceil($total / max($limit, 1)),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $this->validateDefinition($request);
        $slug = ! empty($data['slug']) ? $data['slug'] : Str::slug($data['name']);
        $definition = $this->buildDefinitionPayload($data);

        $model = WorkflowDefinition::create([
            'name' => $data['name'],
            'slug' => $slug,
            'version' => $data['version'] ?? '1.0',
            'description' => $data['description'] ?? null,
            'definition' => $definition,
            'is_active' => $data['is_active'] ?? true,
        ]);

        return $this->sendCreated($model);
    }

    public function show(int $id): JsonResponse
    {
        $model = WorkflowDefinition::find($id);

        if (! $model) {
            return $this->sendError(404, 'NOT_FOUND', 'Workflow definition not found');
        }

        return $this->sendOk($model);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $model = WorkflowDefinition::find($id);

        if (! $model) {
            return $this->sendError(404, 'NOT_FOUND', 'Workflow definition not found');
        }

        $data = $this->validateDefinition($request, $model->id);
        $slug = ! empty($data['slug']) ? $data['slug'] : Str::slug($data['name']);
        $definition = $this->buildDefinitionPayload($data);

        $model->update([
            'name' => $data['name'],
            'slug' => $slug,
            'version' => $data['version'] ?? $model->version,
            'description' => $data['description'] ?? null,
            'definition' => $definition,
            'is_active' => $data['is_active'] ?? $model->is_active,
        ]);

        return $this->sendOk($model->fresh());
    }

    public function destroy(int $id): JsonResponse
    {
        $model = WorkflowDefinition::find($id);

        if ($model) {
            $model->delete();
        }

        return $this->sendOk(['success' => true]);
    }

    /**
     * Start a test run from the configuration UI.
     * Production ST flows start via RegistrationWorkflowStarter on application create.
     */
    public function start(Request $request, int $id): JsonResponse
    {
        $model = WorkflowDefinition::find($id);

        if (! $model) {
            return $this->sendError(404, 'NOT_FOUND', 'Workflow definition not found');
        }

        if (! $model->is_active) {
            return $this->sendError(422, 'INACTIVE', 'Workflow definition is inactive');
        }

        $data = $request->validate([
            'context' => 'nullable|array',
            'instance_id' => 'nullable|string|max:64',
        ]);

        $instanceId = $data['instance_id'] ?? (string) Str::uuid();
        $context = $data['context'] ?? [];

        try {
            $this->engine->start($instanceId, $model->toEngineArray(), $context);
            $status = $this->engine->getStatus($instanceId);
        } catch (Throwable $e) {
            return $this->sendError(422, 'WORKFLOW_START_FAILED', $e->getMessage());
        }

        return $this->sendOk([
            'instance_id' => $instanceId,
            'status' => $status,
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function validateDefinition(Request $request, ?int $ignoreId = null): array
    {
        return $request->validate([
            'name' => 'required|string|max:255',
            'slug' => [
                'nullable',
                'string',
                'max:255',
                'alpha_dash',
                Rule::unique('workflow_definitions', 'slug')->ignore($ignoreId),
            ],
            'version' => 'nullable|string|max:50',
            'description' => 'nullable|string|max:2000',
            'is_active' => 'nullable|boolean',
            'steps' => 'required|array|min:1',
            'steps.*.id' => 'required|string|max:100',
            'steps.*.name' => 'nullable|string|max:255',
            'steps.*.action_key' => ['required', 'string', Rule::in(WorkflowCatalog::allowedActionKeys())],
            'steps.*.sla_target_hours' => 'nullable|integer|min:1|max:8760',
            'steps.*.parameters' => 'nullable|array',
            'transitions' => 'nullable|array',
            'transitions.*.from' => 'required_with:transitions|string|max:100',
            'transitions.*.to' => 'required_with:transitions|string|max:100',
            'transitions.*.condition' => 'nullable|string|max:500',
        ]);
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    private function buildDefinitionPayload(array $data): array
    {
        $steps = [];
        foreach ($data['steps'] as $step) {
            $action = WorkflowCatalog::resolveAction($step['action_key']);
            if ($action === null) {
                abort(422, "Invalid action: {$step['action_key']}");
            }

            $parameters = is_array($step['parameters'] ?? null) ? $step['parameters'] : [];
            $slaTargetHours = array_key_exists('sla_target_hours', $step) && $step['sla_target_hours'] !== null
                ? (int) $step['sla_target_hours']
                : null;

            // Keep human-task engine config in sync (parameters.sla_hours). Inbox countdown is not wired yet.
            if ($slaTargetHours !== null && in_array($step['action_key'], ['human', 'human_task', 'approval'], true)) {
                $parameters['sla_hours'] = $slaTargetHours;
            }

            $row = [
                'id' => $step['id'],
                'name' => $step['name'] ?? $step['id'],
                'action' => $action,
                'parameters' => $parameters,
            ];

            if ($slaTargetHours !== null) {
                $row['sla_target_hours'] = $slaTargetHours;
            }

            $steps[] = $row;
        }

        $payload = [
            'name' => $data['name'],
            'version' => $data['version'] ?? '1.0',
            'steps' => $steps,
        ];

        if (! empty($data['transitions'])) {
            $payload['transitions'] = $data['transitions'];
        }

        return $payload;
    }
}
