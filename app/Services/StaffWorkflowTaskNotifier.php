<?php

namespace App\Services;

use App\Mail\StaffWorkflowTaskMail;
use App\Models\User;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use SolutionForest\WorkflowEngine\Events\WorkflowWaitingEvent;
use Throwable;

/**
 * Sends email when a workflow human task is assigned to SOS / technical / approver.
 *
 * Profile emails on staff users are never modified. Delivery can be redirected
 * via config('st.staff_mail_override') for local/demo simulation.
 */
class StaffWorkflowTaskNotifier
{
    /** @var list<string> */
    public const STAFF_ROLES = ['sos', 'sos_ce', 'technical', 'technical_ce', 'approver'];

    /** @var array<string, string> */
    private const ROLE_LABELS = [
        'sos' => 'Pegawai SOS (OK Elektrik)',
        'sos_ce' => 'Pegawai SOS (Kontraktor Elektrik)',
        'technical' => 'Pegawai Teknikal (OK Elektrik)',
        'technical_ce' => 'Pegawai Teknikal (Kontraktor Elektrik)',
        'approver' => 'Pelulus',
    ];

    public function __construct(
        protected StaffTaskLinkService $taskLinks,
    ) {}

    public function handle(WorkflowWaitingEvent $event): void
    {
        $config = $event->getStepConfig();
        $role = $config['assign_to_role'] ?? null;

        if (! is_string($role) || ! in_array($role, self::STAFF_ROLES, true)) {
            return;
        }

        $data = $event->getData();

        $this->notifyForRole($role, [
            'ref_no' => is_string($data['ref_no'] ?? null) ? $data['ref_no'] : null,
            'applicant_name' => is_string($data['applicant_name'] ?? null) ? $data['applicant_name'] : null,
            'module_code' => is_string($data['module_code'] ?? null) ? $data['module_code'] : null,
            'application_id' => isset($data['application_id']) && is_numeric($data['application_id'])
                ? (int) $data['application_id']
                : null,
            'step_id' => $event->getStepId(),
            'workflow_instance_id' => $event->getWorkflowId(),
        ]);
    }

    /**
     * @param  array{
     *   ref_no?: string|null,
     *   applicant_name?: string|null,
     *   module_code?: string|null,
     *   application_id?: int|null,
     *   application_code?: string|null,
     *   step_id?: string|null,
     *   action_path?: string|null,
     *   workflow_instance_id?: string|null,
     * }  $context
     */
    public function notifyForRole(string $role, array $context = []): bool
    {
        if (! in_array($role, self::STAFF_ROLES, true)) {
            return false;
        }

        $applicationId = isset($context['application_id']) && is_numeric($context['application_id'])
            ? (int) $context['application_id']
            : null;
        $moduleCode = is_string($context['module_code'] ?? null) ? $context['module_code'] : null;
        $refNo = is_string($context['ref_no'] ?? null) ? $context['ref_no'] : null;
        $applicantName = is_string($context['applicant_name'] ?? null) ? $context['applicant_name'] : null;
        $applicationCode = is_string($context['application_code'] ?? null) ? $context['application_code'] : null;
        $stepId = is_string($context['step_id'] ?? null) ? $context['step_id'] : null;

        $intended = User::query()
            ->where('role', $role)
            ->where('is_active', true)
            ->orderBy('id')
            ->first();

        $override = config('st.staff_mail_override');
        $to = is_string($override) && trim($override) !== ''
            ? trim($override)
            : ($intended?->email);

        if (! is_string($to) || $to === '') {
            Log::warning('Staff workflow task email skipped: no recipient', [
                'role' => $role,
                'workflow_instance_id' => $context['workflow_instance_id'] ?? null,
                'application_id' => $applicationId,
            ]);

            return false;
        }

        // Always open Peti Tugasan so staff process by FIFO (not a single application detail).
        $actionUrl = $this->buildActionUrl();

        $payload = [
            'role' => $role,
            'role_label' => self::ROLE_LABELS[$role] ?? $role,
            'ref_no' => $refNo,
            'applicant_name' => $applicantName,
            'module_code' => $moduleCode,
            'step_id' => $stepId,
            'action_url' => $actionUrl,
            'intended_name' => $intended?->name,
            'intended_email' => $intended?->email,
        ];

        try {
            Mail::to($to)->send(new StaffWorkflowTaskMail($payload));
            Log::info('Staff workflow task email sent', [
                'role' => $role,
                'to' => $to,
                'ref_no' => $refNo,
                'action_url' => $actionUrl,
            ]);

            // Remember last staff assignment so email deep links can heal stale mock UI state.
            if (is_string($applicationCode) && $applicationCode !== '') {
                Cache::put(
                    'st.staff_task.'.$applicationCode,
                    [
                        'role' => $role,
                        'ref_no' => $refNo,
                        'module_code' => $moduleCode,
                        'action_url' => $actionUrl,
                        'notified_at' => now()->toIso8601String(),
                    ],
                    now()->addDays(14),
                );
            }

            return true;
        } catch (Throwable $e) {
            Log::error('Failed to send staff workflow task email', [
                'role' => $role,
                'to' => $to,
                'workflow_instance_id' => $context['workflow_instance_id'] ?? null,
                'application_id' => $applicationId,
                'error' => $e->getMessage(),
            ]);

            return false;
        }
    }

    private function buildActionUrl(): string
    {
        $frontend = rtrim((string) config('st.frontend_url', ''), '/');

        return $this->taskLinks->sealUrl($frontend, '/st/inbox');
    }
}
