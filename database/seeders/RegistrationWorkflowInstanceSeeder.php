<?php

namespace Database\Seeders;

use App\Models\StRegistrationApplication;
use App\Services\RegistrationWorkflowStarter;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use SolutionForest\WorkflowEngine\Core\WorkflowEngine;
use SolutionForest\WorkflowEngine\Core\WorkflowState;
use SolutionForest\WorkflowEngine\Laravel\Models\WorkflowTask;
use SolutionForest\WorkflowEngine\Laravel\Services\TaskQueueService;
use Throwable;

/**
 * Starts engine workflow instances for seeded ST registration sample apps
 * and advances each run to the human gate matching the application status.
 */
class RegistrationWorkflowInstanceSeeder extends Seeder
{
    public function __construct(
        protected RegistrationWorkflowStarter $starter,
        protected WorkflowEngine $engine,
        protected TaskQueueService $tasks,
    ) {}

    public function run(): void
    {
        Mail::fake();

        $apps = StRegistrationApplication::query()
            ->whereIn('module_code', ['RG-KE', 'RG-CE'])
            ->orderBy('id')
            ->get();

        foreach ($apps as $app) {
            try {
                $this->seedInstanceFor($app);
            } catch (Throwable $e) {
                Log::error('Failed to seed workflow instance for registration sample', [
                    'code' => $app->code,
                    'error' => $e->getMessage(),
                ]);
                $this->command?->error("  {$app->code}: {$e->getMessage()}");
            }
        }
    }

    private function seedInstanceFor(StRegistrationApplication $app): void
    {
        if ($app->workflow_instance_id) {
            try {
                $this->engine->cancel($app->workflow_instance_id, 'Replaced by RegistrationWorkflowInstanceSeeder');
            } catch (Throwable) {
                // Instance may already be terminal / missing — continue.
            }

            WorkflowTask::query()
                ->where('workflow_instance_id', $app->workflow_instance_id)
                ->whereIn('status', ['open', 'claimed'])
                ->update(['status' => 'cancelled']);

            $app->forceFill(['workflow_instance_id' => null])->save();
        }

        $instanceId = $this->starter->startForApplication($app->fresh());
        if ($instanceId === null) {
            $this->command?->warn("  {$app->code}: no workflow started (missing definition?)");

            return;
        }

        $outcomes = $this->outcomesForStatus((string) $app->module_code, (string) $app->status);
        foreach ($outcomes as $outcome) {
            $this->completeCurrentTask($instanceId, $outcome, $app);
        }

        $instance = $this->engine->getInstance($instanceId);
        $step = $instance->getCurrentStepId() ?? '(done)';
        $state = $instance->getState()->value;
        $this->command?->info("  {$app->code} → {$state} @ {$step}");
    }

    /**
     * @return list<string>
     */
    private function outcomesForStatus(string $moduleCode, string $status): array
    {
        if ($moduleCode === 'RG-KE') {
            return match ($status) {
                'awaiting_employer_confirm' => [],
                'awaiting_processing_payment' => ['confirm'],
                'sos_review' => ['confirm', 'paid'],
                'technical_review' => ['confirm', 'paid', 'lengkap'],
                'query_applicant' => ['confirm', 'paid', 'kemaskini'],
                'pending_approval' => ['confirm', 'paid', 'lengkap', 'lengkap'],
                'awaiting_registration_payment' => ['confirm', 'paid', 'lengkap', 'lengkap', 'lulus'],
                'certificate_issued' => ['confirm', 'paid', 'lengkap', 'lengkap', 'lulus', 'paid'],
                'rejected' => ['confirm', 'paid', 'ditolak'],
                'withdrawn' => [],
                default => ['confirm', 'paid'],
            };
        }

        // RG-CE
        return match ($status) {
            'awaiting_employer_confirm' => [],
            'awaiting_processing_payment' => ['accept', 'submit'],
            'sos_review' => ['accept', 'submit', 'paid'],
            'technical_review' => ['accept', 'submit', 'paid', 'lengkap'],
            'query_applicant' => ['accept', 'submit', 'paid', 'kemaskini'],
            'pending_approval' => ['accept', 'submit', 'paid', 'lengkap', 'lengkap'],
            'awaiting_registration_payment' => ['accept', 'submit', 'paid', 'lengkap', 'lengkap', 'lulus'],
            'certificate_issued' => ['accept', 'submit', 'paid', 'lengkap', 'lengkap', 'lulus', 'paid'],
            'rejected' => ['accept', 'submit', 'paid', 'ditolak'],
            'withdrawn' => [],
            default => ['accept', 'submit', 'paid'],
        };
    }

    private function completeCurrentTask(string $instanceId, string $outcome, StRegistrationApplication $app): void
    {
        $instance = $this->engine->getInstance($instanceId);
        if ($instance->getState() !== WorkflowState::WAITING) {
            throw new \RuntimeException(
                "Expected WAITING before outcome '{$outcome}', got {$instance->getState()->value}"
            );
        }

        $stepId = $instance->getCurrentStepId();
        $task = WorkflowTask::query()
            ->where('workflow_instance_id', $instanceId)
            ->where('step_id', $stepId)
            ->whereIn('status', ['open', 'claimed'])
            ->first();

        $note = $outcome === 'kemaskini'
            ? ($app->note ?: 'Dokumen tidak lengkap — sila kemaskini')
            : 'Seeded sample progression';

        if ($task) {
            $this->tasks->complete($task->id, $outcome, [
                'completed_by' => 'seeder',
                'note' => $note,
            ]);

            return;
        }

        $this->engine->completeHumanTask($instanceId, $outcome, [
            'completed_by' => 'seeder',
            'note' => $note,
        ]);
    }
}
