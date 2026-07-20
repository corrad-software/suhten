<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\WorkflowDefinitionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use SolutionForest\WorkflowEngine\Core\WorkflowEngine;
use SolutionForest\WorkflowEngine\Core\WorkflowState;
use SolutionForest\WorkflowEngine\Laravel\Models\WorkflowTask;
use Tests\TestCase;

class RegistrationWorkflowDefinitionTest extends TestCase
{
    use RefreshDatabase;

    private function authUser(): User
    {
        return User::factory()->create(['is_active' => true]);
    }

    public function test_seeded_ok_electric_waits_on_employer_for_company_path(): void
    {
        $this->seed(WorkflowDefinitionSeeder::class);
        $user = $this->authUser();

        $definition = \App\Models\WorkflowDefinition::query()->where('slug', 'pfd-rg-ke-na')->firstOrFail();
        $this->assertSame('2.0', $definition->version);

        $response = $this->actingAs($user)->postJson("/api/workflows/{$definition->id}/start", [
            'context' => [
                'employer_category' => 'company',
                'ref_no' => 'RG-KE-PROD-1',
                'applicant_name' => 'Siti Aminah',
                'module_code' => 'RG-KE',
                'user' => ['name' => 'Siti', 'email' => 'siti@example.com'],
            ],
        ]);

        $response->assertStatus(200);
        $instanceId = $response->json('data.instanceId');
        $this->assertNotEmpty($instanceId);

        $engine = app(WorkflowEngine::class);
        $instance = $engine->getInstance($instanceId);
        $this->assertSame(WorkflowState::WAITING, $instance->getState());
        $this->assertSame('na-03-pengesahan-pelantikan', $instance->getCurrentStepId());

        $task = WorkflowTask::query()
            ->where('workflow_instance_id', $instanceId)
            ->where('assign_to_role', 'employer')
            ->first();
        $this->assertNotNull($task);
    }

    public function test_seeded_ok_electric_self_employed_skips_to_processing_fee(): void
    {
        $this->seed(WorkflowDefinitionSeeder::class);
        $user = $this->authUser();
        $definition = \App\Models\WorkflowDefinition::query()->where('slug', 'pfd-rg-ke-na')->firstOrFail();

        $response = $this->actingAs($user)->postJson("/api/workflows/{$definition->id}/start", [
            'context' => [
                'employer_category' => 'self_employed',
                'ref_no' => 'RG-KE-PROD-2',
                'applicant_name' => 'Self Employed OK',
                'module_code' => 'RG-KE',
                'user' => ['name' => 'OK', 'email' => 'ok@example.com'],
            ],
        ]);

        $response->assertStatus(200);
        $instanceId = $response->json('data.instanceId');

        $instance = app(WorkflowEngine::class)->getInstance($instanceId);
        $this->assertSame(WorkflowState::WAITING, $instance->getState());
        $this->assertSame('na-04-bayaran-fi-proses', $instance->getCurrentStepId());
    }

    public function test_seeded_contractor_waits_on_ok_appointment(): void
    {
        $this->seed(WorkflowDefinitionSeeder::class);
        $user = $this->authUser();
        $definition = \App\Models\WorkflowDefinition::query()->where('slug', 'pfd-rg-ce-na')->firstOrFail();
        $this->assertSame('2.0', $definition->version);

        $response = $this->actingAs($user)->postJson("/api/workflows/{$definition->id}/start", [
            'context' => [
                'ref_no' => 'RG-CE-PROD-1',
                'applicant_name' => 'Syarikat ABC',
                'module_code' => 'RG-CE',
                'user' => ['name' => 'Wakil', 'email' => 'wakil@example.com'],
            ],
        ]);

        $response->assertStatus(200);
        $instanceId = $response->json('data.instanceId');

        $instance = app(WorkflowEngine::class)->getInstance($instanceId);
        $this->assertSame(WorkflowState::WAITING, $instance->getState());
        $this->assertSame('na-03-menerima-pelantikan', $instance->getCurrentStepId());

        $task = WorkflowTask::query()
            ->where('workflow_instance_id', $instanceId)
            ->where('assign_to_role', 'ok')
            ->first();
        $this->assertNotNull($task);
    }

    public function test_ok_electric_sos_kemaskini_returns_to_sos_after_resubmit(): void
    {
        $this->seed(WorkflowDefinitionSeeder::class);
        $engine = app(WorkflowEngine::class);
        $definition = \App\Models\WorkflowDefinition::query()->where('slug', 'pfd-rg-ke-na')->firstOrFail();

        $instanceId = (string) \Illuminate\Support\Str::uuid();
        $engine->start($instanceId, $definition->toEngineArray(), [
            'employer_category' => 'self_employed',
            'ref_no' => 'RG-KE-LOOP-1',
            'applicant_name' => 'Loop Test',
            'user' => ['name' => 'Loop', 'email' => 'loop@example.com'],
        ]);

        // Pay processing fee → SOS
        $engine->completeHumanTask($instanceId, 'paid');
        $this->assertSame('na-05-semakan-dokumen', $engine->getInstance($instanceId)->getCurrentStepId());

        // SOS queries applicant
        $engine->completeHumanTask($instanceId, 'kemaskini', ['note' => 'Dokumen tidak jelas']);
        $this->assertSame('na-07-kemaskini-permohonan', $engine->getInstance($instanceId)->getCurrentStepId());
        $this->assertSame('sos', $engine->getInstance($instanceId)->getData()['query_return_role']);

        // Applicant resubmits → back to SOS (re-opened)
        $engine->completeHumanTask($instanceId, 'resubmit');
        $after = $engine->getInstance($instanceId);
        $this->assertSame(WorkflowState::WAITING, $after->getState());
        $this->assertSame('na-05-semakan-dokumen', $after->getCurrentStepId());
        $this->assertFalse($after->isStepCompleted('na-05-semakan-dokumen'));
    }
}
