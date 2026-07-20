<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\WorkflowDefinition;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WorkflowDefinitionTest extends TestCase
{
    use RefreshDatabase;

    private function authUser(): User
    {
        return User::factory()->create(['is_active' => true]);
    }

    public function test_index_requires_authentication(): void
    {
        $this->getJson('/api/workflows')
            ->assertStatus(401);
    }

    public function test_catalog_returns_built_in_actions(): void
    {
        $this->actingAs($this->authUser());

        $this->getJson('/api/workflows/catalog')
            ->assertStatus(200)
            ->assertJsonPath('data.actions.0.key', 'log');
    }

    public function test_can_create_list_and_show_workflow(): void
    {
        $this->actingAs($this->authUser());

        $create = $this->postJson('/api/workflows', [
            'name' => 'User Onboarding',
            'description' => 'Test workflow',
            'steps' => [
                [
                    'id' => 'welcome',
                    'name' => 'Welcome',
                    'action_key' => 'log',
                    'parameters' => [
                        'message' => 'Hello {{ user.name }}',
                        'level' => 'info',
                    ],
                ],
            ],
        ]);

        $create->assertStatus(201)
            ->assertJsonPath('data.name', 'User Onboarding')
            ->assertJsonPath('data.slug', 'user-onboarding');

        $id = $create->json('data.id');

        $this->getJson('/api/workflows')
            ->assertStatus(200)
            ->assertJsonPath('meta.total', 1);

        $this->getJson("/api/workflows/{$id}")
            ->assertStatus(200)
            ->assertJsonPath('data.definition.steps.0.id', 'welcome');
    }

    public function test_start_runs_workflow_instance(): void
    {
        $this->actingAs($this->authUser());

        $definition = WorkflowDefinition::create([
            'name' => 'Simple Log',
            'slug' => 'simple-log',
            'version' => '1.0',
            'description' => null,
            'is_active' => true,
            'definition' => [
                'name' => 'Simple Log',
                'version' => '1.0',
                'steps' => [
                    [
                        'id' => 'log-1',
                        'name' => 'Log',
                        'action' => 'log',
                        'parameters' => [
                            'message' => 'Hello',
                            'level' => 'info',
                        ],
                    ],
                ],
            ],
        ]);

        $response = $this->postJson("/api/workflows/{$definition->id}/start", [
            'context' => ['user' => ['name' => 'Ada']],
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure(['data' => ['instanceId', 'status']]);
    }

    public function test_rejects_unknown_action_key(): void
    {
        $this->actingAs($this->authUser());

        $this->postJson('/api/workflows', [
            'name' => 'Bad Action',
            'steps' => [
                [
                    'id' => 'x',
                    'action_key' => 'not-a-real-action',
                    'parameters' => [],
                ],
            ],
        ])->assertStatus(422);
    }

    public function test_persists_sla_target_hours_per_step(): void
    {
        $this->actingAs($this->authUser());

        $create = $this->postJson('/api/workflows', [
            'name' => 'SLA Setup',
            'steps' => [
                [
                    'id' => 'sos-gate',
                    'name' => 'SOS Review',
                    'action_key' => 'human',
                    'sla_target_hours' => 4,
                    'parameters' => [
                        'assign_to_role' => 'sos',
                        'outcomes' => 'lengkap,ditolak',
                        'tab' => 'new',
                    ],
                ],
                [
                    'id' => 'log-done',
                    'name' => 'Done',
                    'action_key' => 'log',
                    'sla_target_hours' => 24,
                    'parameters' => [
                        'message' => 'Done',
                        'level' => 'info',
                    ],
                ],
            ],
        ]);

        $create->assertStatus(201)
            ->assertJsonPath('data.definition.steps.0.slaTargetHours', 4)
            ->assertJsonPath('data.definition.steps.0.parameters.slaHours', 4)
            ->assertJsonPath('data.definition.steps.1.slaTargetHours', 24);

        $id = $create->json('data.id');
        $stored = WorkflowDefinition::find($id);
        $this->assertSame(4, $stored?->definition['steps'][0]['sla_target_hours'] ?? null);
        $this->assertSame(4, $stored?->definition['steps'][0]['parameters']['sla_hours'] ?? null);
        $this->assertSame(24, $stored?->definition['steps'][1]['sla_target_hours'] ?? null);
        $this->assertArrayNotHasKey('sla_hours', $stored?->definition['steps'][1]['parameters'] ?? []);
    }
}
