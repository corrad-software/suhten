<?php

namespace App\Services;

use App\Models\StRegistrationApplication;
use App\Models\WorkflowDefinition;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use SolutionForest\WorkflowEngine\Core\WorkflowEngine;
use Throwable;

/**
 * Starts engine workflow instances when ST registration applications are created.
 */
class RegistrationWorkflowStarter
{
    /** @var array<string, string> module_code => workflow definition slug */
    public const MODULE_WORKFLOW_SLUGS = [
        'RG-KE' => 'pfd-rg-ke-na',
        'RG-CE' => 'pfd-rg-ce-na',
    ];

    public function __construct(
        protected WorkflowEngine $engine,
    ) {}

    /**
     * Start the mapped workflow for the application, if configured and active.
     * Failures are logged and do not block application creation.
     */
    public function startForApplication(StRegistrationApplication $application): ?string
    {
        $slug = self::MODULE_WORKFLOW_SLUGS[$application->module_code] ?? null;
        if ($slug === null) {
            return null;
        }

        $definition = WorkflowDefinition::query()
            ->where('slug', $slug)
            ->where('is_active', true)
            ->first();

        if (! $definition) {
            Log::warning('No active workflow definition for registration module', [
                'module_code' => $application->module_code,
                'slug' => $slug,
                'application_id' => $application->id,
            ]);

            return null;
        }

        $instanceId = (string) Str::uuid();
        $detail = is_array($application->detail) ? $application->detail : [];
        $email = is_string($detail['email'] ?? null) ? $detail['email'] : null;

        $context = [
            'application_id' => $application->id,
            'application_code' => $application->code,
            'module_code' => $application->module_code,
            'ref_no' => $application->ref_no,
            'app_type' => $application->app_type,
            'status' => $application->status,
            'applicant_name' => $application->applicant_name,
            // Drives RG-KE company vs self-employed branch (default company)
            'employer_category' => $this->resolveEmployerCategory($detail, $application->status),
            'user' => [
                'name' => $application->applicant_name,
                'email' => $email ?? 'noreply@example.com',
            ],
        ];

        try {
            $this->engine->start($instanceId, $definition->toEngineArray(), $context);
        } catch (Throwable $e) {
            Log::error('Failed to start registration workflow', [
                'module_code' => $application->module_code,
                'slug' => $slug,
                'application_id' => $application->id,
                'error' => $e->getMessage(),
            ]);

            return null;
        }

        $application->forceFill(['workflow_instance_id' => $instanceId])->save();

        return $instanceId;
    }

    /**
     * @param array<string, mixed> $detail
     */
    private function resolveEmployerCategory(array $detail, ?string $status): string
    {
        $raw = $detail['employerCategory'] ?? $detail['employer_category'] ?? null;
        if (is_string($raw)) {
            $normalized = strtolower(str_replace(['-', ' '], '_', $raw));
            if (in_array($normalized, ['self_employed', 'bekerja_sendiri', 'selfemployed'], true)) {
                return 'self_employed';
            }
            if (in_array($normalized, ['company', 'syarikat'], true)) {
                return 'company';
            }
        }

        // Infer from application status when form already skipped employer confirm
        if ($status === 'awaiting_processing_payment') {
            return 'self_employed';
        }

        return 'company';
    }
}
