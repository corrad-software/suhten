<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use SolutionForest\WorkflowEngine\Core\WorkflowEngine;
use Throwable;

class WorkflowInstanceController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected WorkflowEngine $engine,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $filters = [];
        if ($request->filled('state')) {
            $filters['state'] = $request->input('state');
        }
        if ($request->filled('definition_name')) {
            $filters['definition_name'] = $request->input('definition_name');
        }
        if ($request->filled('limit')) {
            $filters['limit'] = (int) $request->input('limit');
        }

        $instances = $this->engine->getInstances($filters);

        $rows = array_map(function ($instance) {
            $data = $instance->getData();

            return [
                'id' => $instance->getId(),
                'name' => $instance->getName(),
                'state' => $instance->getState()->value,
                'progress' => $instance->getProgress(),
                'completed_steps' => $instance->getCompletedSteps(),
                'failed_steps' => $instance->getFailedSteps(),
                'application_id' => $data['application_id'] ?? null,
                'application_code' => $data['application_code'] ?? null,
                'module_code' => $data['module_code'] ?? null,
                'ref_no' => $data['ref_no'] ?? null,
                'applicant_name' => $data['applicant_name'] ?? null,
            ];
        }, $instances);

        return $this->sendOk($rows, ['total' => count($rows)]);
    }

    public function show(string $id): JsonResponse
    {
        try {
            $status = $this->engine->getStatus($id);
            $instance = $this->engine->getInstance($id);
        } catch (Throwable $e) {
            return $this->sendError(404, 'NOT_FOUND', $e->getMessage());
        }

        return $this->sendOk([
            'id' => $instance->getId(),
            'name' => $instance->getName(),
            'status' => $status,
            'state' => $instance->getState()->value,
            'progress' => $instance->getProgress(),
            'completed_steps' => $instance->getCompletedSteps(),
            'failed_steps' => $instance->getFailedSteps(),
            'context' => $instance->getContext()->getData(),
        ]);
    }

    public function cancel(Request $request, string $id): JsonResponse
    {
        $data = $request->validate([
            'reason' => 'nullable|string|max:500',
        ]);

        try {
            $this->engine->cancel($id, $data['reason'] ?? 'Cancelled from admin UI');
        } catch (Throwable $e) {
            return $this->sendError(422, 'CANCEL_FAILED', $e->getMessage());
        }

        return $this->sendOk(['success' => true, 'id' => $id]);
    }

    public function resume(string $id): JsonResponse
    {
        try {
            $this->engine->resume($id);
            $status = $this->engine->getStatus($id);
        } catch (Throwable $e) {
            return $this->sendError(422, 'RESUME_FAILED', $e->getMessage());
        }

        return $this->sendOk(['id' => $id, 'status' => $status]);
    }
}
