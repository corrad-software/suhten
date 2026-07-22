<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\NotifyApplicantQueryRequest;
use App\Http\Traits\ApiResponse;
use App\Services\ApplicantQueryNotifier;
use Illuminate\Http\JsonResponse;

/**
 * Explicit notify endpoint for Pertanyaan (raise_query) from the mock UI
 * state machine — emails the applicant (or ST_STAFF_MAIL_OVERRIDE in demo).
 */
class ApplicantQueryNotifyController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected ApplicantQueryNotifier $notifier,
    ) {}

    public function store(NotifyApplicantQueryRequest $request): JsonResponse
    {
        $data = $request->validated();

        $sent = $this->notifier->notify([
            'applicant_email' => $data['applicant_email'],
            'note' => $data['note'],
            'ref_no' => $data['ref_no'] ?? null,
            'applicant_name' => $data['applicant_name'] ?? null,
            'module_code' => $data['module_code'] ?? null,
            'application_id' => $data['application_id'] ?? null,
            'application_code' => $data['application_code'] ?? null,
            'action_path' => $data['action_path'] ?? null,
        ]);

        if (! $sent) {
            return $this->sendError(422, 'NOTIFY_FAILED', 'Applicant query email was not sent');
        }

        return $this->sendOk(['success' => true]);
    }
}
