<?php

namespace Tests\Feature;

use App\Enums\Permission;
use App\Models\Role;
use App\Models\StRegistrationApplication;
use App\Models\User;
use App\Models\WorkflowDefinition;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StRegistrationApplicationTest extends TestCase
{
    use RefreshDatabase;

    private function userWithPermissions(array $permissions): User
    {
        $role = Role::create([
            'name' => 'test-reg-'.uniqid(),
            'description' => 'Test role',
            'permissions' => $permissions,
        ]);

        return User::factory()->create([
            'role' => $role->name,
            'role_id' => $role->id,
            'is_active' => true,
        ]);
    }

    public function test_index_requires_authentication(): void
    {
        $this->getJson('/api/st/registration-applications')
            ->assertStatus(401);
    }

    public function test_index_forbidden_without_permission(): void
    {
        $this->actingAs($this->userWithPermissions([]));

        $this->getJson('/api/st/registration-applications')
            ->assertStatus(403)
            ->assertJsonPath('error.code', 'FORBIDDEN');
    }

    public function test_index_returns_seeded_shape(): void
    {
        $this->actingAs($this->userWithPermissions([Permission::REGISTRATION_VIEW]));

        StRegistrationApplication::create([
            'code' => 'rg-ke-1',
            'module_code' => 'RG-KE',
            'ref_no' => 'ST/RG-KE/2026/00041',
            'app_type' => 'new_registration',
            'applicant_name' => 'Ahmad bin Ismail',
            'identity_no' => '850101-10-5432',
            'category_or_class' => 'PW4',
            'status' => 'sos_review',
            'submitted_at' => now()->subDays(2),
            'stage_entered_at' => now()->subHours(18),
            'sla_target_hours' => 24,
            'fee_amount' => 50,
        ]);

        $this->getJson('/api/st/registration-applications?module_code=RG-KE')
            ->assertStatus(200)
            ->assertJsonPath('meta.total', 1)
            ->assertJsonPath('data.0.moduleCode', 'RG-KE')
            ->assertJsonPath('data.0.refNo', 'ST/RG-KE/2026/00041');
    }

    public function test_store_validation_error(): void
    {
        $this->actingAs($this->userWithPermissions([Permission::REGISTRATION_CREATE]));

        $this->postJson('/api/st/registration-applications', [])
            ->assertStatus(422)
            ->assertJsonPath('error.code', 'VALIDATION_ERROR');
    }

    public function test_store_creates_application(): void
    {
        $this->actingAs($this->userWithPermissions([Permission::REGISTRATION_CREATE]));

        $this->postJson('/api/st/registration-applications', [
            'moduleCode' => 'RG-KE',
            'appType' => 'new_registration',
            'applicantName' => 'Test Applicant',
            'identityNo' => '900101-01-0001',
            'categoryOrClass' => 'PW2',
            'status' => 'awaiting_processing_payment',
            'feeAmount' => 50,
        ])
            ->assertStatus(201)
            ->assertJsonPath('data.moduleCode', 'RG-KE')
            ->assertJsonPath('data.applicantName', 'Test Applicant');

        $this->assertDatabaseCount('st_registration_applications', 1);
    }

    public function test_store_rg_ke_starts_linked_workflow(): void
    {
        $this->actingAs($this->userWithPermissions([Permission::REGISTRATION_CREATE]));

        WorkflowDefinition::create([
            'name' => 'Pendaftaran OK Elektrik (PFD-RG-KE-NA)',
            'slug' => 'pfd-rg-ke-na',
            'version' => '1.0',
            'description' => 'Test link',
            'is_active' => true,
            'definition' => [
                'name' => 'Pendaftaran OK Elektrik (PFD-RG-KE-NA)',
                'version' => '1.0',
                'steps' => [
                    [
                        'id' => 'na-01',
                        'name' => 'Membuat Permohonan',
                        'action' => 'log',
                        'parameters' => [
                            'message' => 'RG-KE started for {{ applicant_name }}',
                            'level' => 'info',
                        ],
                    ],
                ],
            ],
        ]);

        $response = $this->postJson('/api/st/registration-applications', [
            'moduleCode' => 'RG-KE',
            'appType' => 'new_registration',
            'applicantName' => 'Workflow Linked Applicant',
            'identityNo' => '900101-01-0002',
            'categoryOrClass' => 'PW4',
            'status' => 'awaiting_employer_confirm',
            'feeAmount' => 50,
            'detail' => [
                'email' => 'ok@example.com',
            ],
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.moduleCode', 'RG-KE');

        $instanceId = $response->json('data.workflowInstanceId');
        $this->assertNotEmpty($instanceId);
        $this->assertDatabaseHas('st_registration_applications', [
            'applicant_name' => 'Workflow Linked Applicant',
            'workflow_instance_id' => $instanceId,
        ]);
        $this->assertDatabaseHas('workflow_instances', [
            'id' => $instanceId,
        ]);

        $applicationCode = $response->json('data.code');
        $list = $this->getJson('/api/workflow-instances?limit=50');
        $list->assertStatus(200);
        $row = collect($list->json('data'))->firstWhere('id', $instanceId);
        $this->assertNotNull($row);
        $this->assertSame($applicationCode, $row['applicationCode'] ?? null);
        $this->assertSame('RG-KE', $row['moduleCode'] ?? null);
        $this->assertSame('Workflow Linked Applicant', $row['applicantName'] ?? null);
        $this->assertNotEmpty($row['refNo'] ?? null);
    }

    public function test_store_rg_ce_starts_linked_workflow(): void
    {
        $this->actingAs($this->userWithPermissions([Permission::REGISTRATION_CREATE]));

        WorkflowDefinition::create([
            'name' => 'Pendaftaran Kontraktor Elektrik (PFD-RG-CE-NA)',
            'slug' => 'pfd-rg-ce-na',
            'version' => '1.0',
            'description' => 'Test link',
            'is_active' => true,
            'definition' => [
                'name' => 'Pendaftaran Kontraktor Elektrik (PFD-RG-CE-NA)',
                'version' => '1.0',
                'steps' => [
                    [
                        'id' => 'na-01',
                        'name' => 'Membuat Permohonan',
                        'action' => 'log',
                        'parameters' => [
                            'message' => 'RG-CE started for {{ applicant_name }}',
                            'level' => 'info',
                        ],
                    ],
                ],
            ],
        ]);

        $response = $this->postJson('/api/st/registration-applications', [
            'moduleCode' => 'RG-CE',
            'appType' => 'new_registration',
            'applicantName' => 'Contractor Co',
            'identityNo' => '201501012345',
            'categoryOrClass' => 'B',
            'status' => 'awaiting_employer_confirm',
            'feeAmount' => 200,
            'detail' => [
                'email' => 'contractor@example.com',
            ],
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.moduleCode', 'RG-CE');

        $instanceId = $response->json('data.workflowInstanceId');
        $this->assertNotEmpty($instanceId);
        $this->assertDatabaseHas('st_registration_applications', [
            'applicant_name' => 'Contractor Co',
            'workflow_instance_id' => $instanceId,
        ]);
        $this->assertDatabaseHas('workflow_instances', [
            'id' => $instanceId,
        ]);

        $applicationCode = $response->json('data.code');
        $list = $this->getJson('/api/workflow-instances?limit=50');
        $list->assertStatus(200);
        $row = collect($list->json('data'))->firstWhere('id', $instanceId);
        $this->assertNotNull($row);
        $this->assertSame($applicationCode, $row['applicationCode'] ?? null);
        $this->assertSame('RG-CE', $row['moduleCode'] ?? null);
        $this->assertSame('Contractor Co', $row['applicantName'] ?? null);
        $this->assertNotEmpty($row['refNo'] ?? null);
    }

    public function test_show_by_code(): void
    {
        $this->actingAs($this->userWithPermissions([Permission::REGISTRATION_VIEW]));

        StRegistrationApplication::create([
            'code' => 'rg-ce-1',
            'module_code' => 'RG-CE',
            'ref_no' => 'ST/RG-CE/2026/00061',
            'app_type' => 'new_registration',
            'applicant_name' => 'Elektro Prima Sdn Bhd',
            'identity_no' => '201501012345',
            'category_or_class' => 'B',
            'status' => 'technical_review',
            'submitted_at' => now(),
            'stage_entered_at' => now(),
            'sla_target_hours' => 72,
        ]);

        $this->getJson('/api/st/registration-applications/by-code/rg-ce-1')
            ->assertStatus(200)
            ->assertJsonPath('data.code', 'rg-ce-1')
            ->assertJsonPath('data.moduleCode', 'RG-CE');
    }
}
