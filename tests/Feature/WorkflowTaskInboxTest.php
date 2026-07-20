<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\WorkflowDefinition;
use Illuminate\Foundation\Testing\RefreshDatabase;
use SolutionForest\WorkflowEngine\Laravel\Models\WorkflowTask;
use Tests\TestCase;

class WorkflowTaskInboxTest extends TestCase
{
    use RefreshDatabase;

    private function authUser(): User
    {
        return User::factory()->create(['is_active' => true]);
    }

    /**
     * @return array{0: WorkflowDefinition, 1: string}
     */
    private function startTwoGateWorkflow(User $user): array
    {
        $definition = WorkflowDefinition::create([
            'name' => 'Inbox Demo',
            'slug' => 'inbox-demo',
            'version' => '1.0',
            'description' => null,
            'is_active' => true,
            'definition' => [
                'name' => 'Inbox Demo',
                'version' => '1.0',
                'steps' => [
                    [
                        'id' => 'sos-review',
                        'name' => 'SOS Review',
                        'action' => 'human',
                        'parameters' => [
                            'assign_to_role' => 'sos',
                            'outcomes' => ['lengkap', 'kemaskini', 'ditolak'],
                            'sla_hours' => 4,
                            'tab' => 'new',
                        ],
                    ],
                    [
                        'id' => 'tech-review',
                        'name' => 'Technical Review',
                        'action' => 'human',
                        'parameters' => [
                            'assign_to_role' => 'technical',
                            'outcomes' => ['lengkap', 'ditolak'],
                            'sla_hours' => 24,
                            'tab' => 'new',
                        ],
                    ],
                ],
            ],
        ]);

        $response = $this->actingAs($user)->postJson("/api/workflows/{$definition->id}/start", [
            'context' => [
                'ref_no' => 'RG-KE-TEST-1',
                'applicant_name' => 'Ahmad Bin Ali',
                'module_code' => 'RG-KE',
                'application_id' => 99,
            ],
        ]);

        $response->assertStatus(200);
        $instanceId = $response->json('data.instanceId')
            ?? $response->json('data.instance_id');

        $this->assertNotEmpty($instanceId);

        return [$definition, (string) $instanceId];
    }

    public function test_inbox_requires_authentication(): void
    {
        $this->getJson('/api/workflow-tasks')
            ->assertStatus(401);
    }

    public function test_human_step_creates_open_task_for_role(): void
    {
        $user = $this->authUser();
        [, $instanceId] = $this->startTwoGateWorkflow($user);

        $task = WorkflowTask::query()
            ->where('workflow_instance_id', $instanceId)
            ->where('step_id', 'sos-review')
            ->first();

        $this->assertNotNull($task);
        $this->assertSame('sos', $task->assign_to_role);
        $this->assertSame('open', $task->status);
        $this->assertSame('new', $task->tab);
        $this->assertSame('RG-KE-TEST-1', $task->ref_no);
        $this->assertSame('Ahmad Bin Ali', $task->applicant_name);
    }

    public function test_inbox_lists_tasks_by_role_and_tab(): void
    {
        $user = $this->authUser();
        $this->startTwoGateWorkflow($user);

        $this->actingAs($user)
            ->getJson('/api/workflow-tasks?role=sos&tab=new')
            ->assertStatus(200)
            ->assertJsonPath('meta.total', 1)
            ->assertJsonPath('data.0.assignToRole', 'sos')
            ->assertJsonPath('data.0.refNo', 'RG-KE-TEST-1');

        $this->actingAs($user)
            ->getJson('/api/workflow-tasks?role=technical&tab=new')
            ->assertStatus(200)
            ->assertJsonPath('meta.total', 0);
    }

    public function test_complete_advances_workflow_and_creates_next_role_task(): void
    {
        $user = $this->authUser();
        [, $instanceId] = $this->startTwoGateWorkflow($user);

        $sosTask = WorkflowTask::query()
            ->where('workflow_instance_id', $instanceId)
            ->where('step_id', 'sos-review')
            ->firstOrFail();

        $this->actingAs($user)
            ->postJson("/api/workflow-tasks/{$sosTask->id}/complete", [
                'outcome' => 'lengkap',
                'note' => 'Dokumen lengkap',
            ])
            ->assertStatus(200)
            ->assertJsonPath('data.status', 'completed')
            ->assertJsonPath('data.outcome', 'lengkap');

        $techTask = WorkflowTask::query()
            ->where('workflow_instance_id', $instanceId)
            ->where('step_id', 'tech-review')
            ->first();

        $this->assertNotNull($techTask);
        $this->assertSame('technical', $techTask->assign_to_role);
        $this->assertSame('open', $techTask->status);

        $this->actingAs($user)
            ->getJson('/api/workflow-tasks?role=technical&tab=new')
            ->assertStatus(200)
            ->assertJsonPath('meta.total', 1);

        $this->actingAs($user)
            ->getJson('/api/workflow-tasks?role=sos&tab=completed')
            ->assertStatus(200)
            ->assertJsonPath('meta.total', 1);
    }

    public function test_complete_validation_error(): void
    {
        $user = $this->authUser();
        [, $instanceId] = $this->startTwoGateWorkflow($user);

        $sosTask = WorkflowTask::query()
            ->where('workflow_instance_id', $instanceId)
            ->where('step_id', 'sos-review')
            ->firstOrFail();

        $this->actingAs($user)
            ->postJson("/api/workflow-tasks/{$sosTask->id}/complete", [])
            ->assertStatus(422)
            ->assertJsonPath('error.code', 'VALIDATION_ERROR');
    }
}
