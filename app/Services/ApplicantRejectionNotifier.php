<?php

namespace App\Services;

use App\Mail\ApplicantRejectionMail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Throwable;

/**
 * Sends email when staff rejects an application.
 *
 * Delivery can be redirected via config('st.staff_mail_override') for local/demo
 * simulation — same override used by staff task and applicant query emails.
 */
class ApplicantRejectionNotifier
{
    public function __construct(
        protected StaffTaskLinkService $taskLinks,
    ) {}

    /**
     * @param  array{
     *   applicant_email: string,
     *   note?: string|null,
     *   ref_no?: string|null,
     *   applicant_name?: string|null,
     *   module_code?: string|null,
     *   application_id?: int|null,
     *   application_code?: string|null,
     *   action_path?: string|null,
     * }  $context
     */
    public function notify(array $context): bool
    {
        $intendedEmail = trim((string) ($context['applicant_email'] ?? ''));
        $note = trim((string) ($context['note'] ?? ''));

        if ($intendedEmail === '') {
            Log::warning('Applicant rejection email skipped: missing email', [
                'ref_no' => $context['ref_no'] ?? null,
            ]);

            return false;
        }

        if ($note === '') {
            $note = 'Permohonan anda telah ditolak. Sila log masuk untuk melihat butiran.';
        }

        $override = config('st.staff_mail_override');
        $to = is_string($override) && trim($override) !== ''
            ? trim($override)
            : $intendedEmail;

        $refNo = is_string($context['ref_no'] ?? null) ? $context['ref_no'] : null;
        $applicantName = is_string($context['applicant_name'] ?? null) ? $context['applicant_name'] : null;
        $moduleCode = is_string($context['module_code'] ?? null) ? $context['module_code'] : null;
        $applicationId = isset($context['application_id']) && is_numeric($context['application_id'])
            ? (int) $context['application_id']
            : null;
        $applicationCode = is_string($context['application_code'] ?? null) ? $context['application_code'] : null;
        $actionPath = is_string($context['action_path'] ?? null) ? $context['action_path'] : null;

        $actionUrl = $this->buildActionUrl($moduleCode, $applicationId, $applicationCode, $actionPath);

        $payload = [
            'ref_no' => $refNo,
            'applicant_name' => $applicantName,
            'module_code' => $moduleCode,
            'note' => $note,
            'action_url' => $actionUrl,
            // Only show the simulation banner when override redirected delivery.
            'intended_email' => ($to !== $intendedEmail) ? $intendedEmail : null,
        ];

        try {
            Mail::to($to)->send(new ApplicantRejectionMail($payload));
            Log::info('Applicant rejection email sent', [
                'to' => $to,
                'intended_email' => $intendedEmail,
                'ref_no' => $refNo,
                'action_url' => $actionUrl,
            ]);

            return true;
        } catch (Throwable $e) {
            Log::error('Failed to send applicant rejection email', [
                'to' => $to,
                'intended_email' => $intendedEmail,
                'ref_no' => $refNo,
                'error' => $e->getMessage(),
            ]);

            return false;
        }
    }

    private function buildActionUrl(
        ?string $moduleCode,
        ?int $applicationId,
        ?string $applicationCode = null,
        ?string $actionPath = null,
    ): string {
        $frontend = rtrim((string) config('st.frontend_url', ''), '/');
        $internal = $this->buildInternalPath($moduleCode, $applicationId, $applicationCode, $actionPath);

        return $this->taskLinks->sealUrl($frontend, $internal);
    }

    private function buildInternalPath(
        ?string $moduleCode,
        ?int $applicationId,
        ?string $applicationCode = null,
        ?string $actionPath = null,
    ): string {
        if (is_string($actionPath) && str_starts_with($actionPath, '/')) {
            return $actionPath;
        }

        $paths = config('st.registration_module_paths', []);
        $modulePath = is_string($moduleCode) && isset($paths[$moduleCode])
            ? $paths[$moduleCode]
            : null;

        if ($modulePath !== null && $applicationId !== null) {
            return '/st/'.$modulePath.'/applications/'.$applicationId;
        }

        if (is_string($applicationCode) && $applicationCode !== '') {
            return '/st/applications/'.$applicationCode.'?stage=rejected';
        }

        return '/st/dashboard';
    }
}
