<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\NotifyStaffWorkflowTaskRequest;
use App\Http\Traits\ApiResponse;
use App\Services\StaffWorkflowTaskNotifier;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

/**
 * Explicit notify endpoint for UI / mock workflow transitions that do not
 * go through the engine WorkflowWaitingEvent (e.g. D11 Pinia state machine).
 */
class StaffWorkflowTaskNotifyController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected StaffWorkflowTaskNotifier $notifier,
    ) {}

    public function store(NotifyStaffWorkflowTaskRequest $request): JsonResponse
    {
        $data = $request->validated();

        $sent = $this->notifier->notifyForRole($data['role'], [
            'ref_no' => $data['ref_no'] ?? null,
            'applicant_name' => $data['applicant_name'] ?? null,
            'module_code' => $data['module_code'] ?? null,
            'application_id' => $data['application_id'] ?? null,
            'application_code' => $data['application_code'] ?? null,
            'step_id' => $data['step_id'] ?? null,
            'action_path' => $data['action_path'] ?? null,
        ]);

        if (! $sent) {
            return $this->sendError(422, 'NOTIFY_FAILED', 'Staff task email was not sent');
        }

        return $this->sendOk(['success' => true]);
    }

    /**
     * Last staff-task email assignment for a mock/application code (deep-link sync).
     */
    public function show(string $code): JsonResponse
    {
        $cached = Cache::get('st.staff_task.'.$code);
        if (! is_array($cached) || ! isset($cached['role'])) {
            return $this->sendError(404, 'NOT_FOUND', 'No staff task notify recorded for this application');
        }

        return $this->sendOk($cached);
    }
}
