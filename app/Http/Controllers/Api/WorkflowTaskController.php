<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CompleteWorkflowTaskRequest;
use App\Http\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use SolutionForest\WorkflowEngine\Laravel\Models\WorkflowTask;
use SolutionForest\WorkflowEngine\Laravel\Services\TaskQueueService;
use Throwable;

class WorkflowTaskController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected TaskQueueService $tasks,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $page = (int) $request->input('page', 1);
        $limit = (int) $request->input('limit', 10);
        $role = $request->input('role');
        $tab = $request->input('tab', 'new');
        $q = $request->input('q');
        $sortBy = $request->input('sort_by', 'stage_entered_at');
        $sortDir = $request->input('sort_dir', 'asc');

        $allowedSort = ['stage_entered_at', 'created_at', 'ref_no', 'applicant_name', 'status'];
        if (! in_array($sortBy, $allowedSort, true)) {
            $sortBy = 'stage_entered_at';
        }
        $sortDir = strtolower((string) $sortDir) === 'desc' ? 'desc' : 'asc';

        $query = WorkflowTask::query();

        if (is_string($role) && $role !== '') {
            $query->where('assign_to_role', $role);
        }

        if ($tab === 'new') {
            $query->whereIn('status', ['open', 'claimed'])->where('tab', 'new');
        } elseif ($tab === 'query') {
            $query->whereIn('status', ['open', 'claimed'])->where('tab', 'query');
        } elseif ($tab === 'completed') {
            $query->where('status', 'completed');
        }

        if (is_string($q) && $q !== '') {
            $query->where(function ($builder) use ($q) {
                $builder->where('ref_no', 'like', "%{$q}%")
                    ->orWhere('applicant_name', 'like', "%{$q}%")
                    ->orWhere('module_code', 'like', "%{$q}%");
            });
        }

        $total = $query->count();
        $rows = $query->orderBy($sortBy, $sortDir)
            ->orderBy('id', 'asc')
            ->skip(($page - 1) * $limit)
            ->take($limit)
            ->get();

        return $this->sendOk($rows, [
            'page' => $page,
            'limit' => $limit,
            'total' => $total,
            'totalPages' => (int) ceil($total / max($limit, 1)),
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $task = WorkflowTask::query()->find($id);
        if (! $task) {
            return $this->sendError(404, 'NOT_FOUND', 'Workflow task not found');
        }

        return $this->sendOk($task);
    }

    public function claim(Request $request, int $id): JsonResponse
    {
        $user = $request->user();
        if (! $user) {
            return $this->sendError(401, 'UNAUTHORIZED', 'Unauthenticated');
        }

        try {
            $task = $this->tasks->claim($id, (int) $user->id);
        } catch (Throwable $e) {
            return $this->sendError(422, 'CLAIM_FAILED', $e->getMessage());
        }

        return $this->sendOk($task);
    }

    public function complete(CompleteWorkflowTaskRequest $request, int $id): JsonResponse
    {
        $user = $request->user();
        $data = $request->validated();

        try {
            $task = $this->tasks->complete($id, $data['outcome'], [
                'completed_by' => $user ? (string) $user->id : null,
                'note' => $data['note'] ?? null,
                'user_id' => $user?->id,
            ]);
        } catch (Throwable $e) {
            $code = $e instanceof \InvalidArgumentException ? 'VALIDATION_ERROR' : 'COMPLETE_FAILED';
            $status = $e instanceof \InvalidArgumentException ? 422 : 422;

            return $this->sendError($status, $code, $e->getMessage());
        }

        return $this->sendOk($task);
    }
}
