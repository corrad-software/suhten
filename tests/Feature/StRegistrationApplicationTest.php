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

    public function test_store_allocates_unique_ref_no_after_seeded_gaps(): void
    {
        $this->actingAs($this->userWithPermissions([Permission::REGISTRATION_CREATE]));

        // Seed a high ref while total row count is still 1 — old count()+1 would
        // collide on ST/RG-KE/2026/00002 when 00002 already exists as a gap.
        StRegistrationApplication::create([
            'code' => 'rg-ke-gap-seed',
            'module_code' => 'RG-KE',
            'ref_no' => 'ST/RG-KE/2026/00044',
            'app_type' => 'new_registration',
            'applicant_name' => 'Seeded Gap',
            'identity_no' => '800101-01-0001',
            'category_or_class' => 'PW',
            'status' => 'sos_review',
            'submitted_at' => now(),
            'stage_entered_at' => now(),
            'sla_target_hours' => 24,
        ]);

        $response = $this->postJson('/api/st/registration-applications', [
            'moduleCode' => 'RG-KE',
            'appType' => 'new_registration',
            'applicantName' => 'Nur Aisyah binti Hassan',
            'identityNo' => '920814-14-5688',
            'categoryOrClass' => 'PW',
            'status' => 'awaiting_employer_confirm',
            'employerName' => 'ABC Elektrik Sdn Bhd',
            'feeAmount' => 50,
            'detail' => [
                'applicantPersonaId' => 'p-aisyah',
                'employerId' => 'emp-abc-elektrik',
                'employerCategory' => 'company',
                'email' => 'aisyah.hassan@email.my',
            ],
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.applicantName', 'Nur Aisyah binti Hassan')
            ->assertJsonPath('data.employerName', 'ABC Elektrik Sdn Bhd')
            ->assertJsonPath('data.status', 'awaiting_employer_confirm');

        $refNo = $response->json('data.refNo');
        $this->assertNotSame('ST/RG-KE/2026/00044', $refNo);
        $this->assertSame('ST/RG-KE/2026/00045', $refNo);
        $this->assertDatabaseCount('st_registration_applications', 2);
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

    public function test_employer_index_only_returns_own_organisation_apps(): void
    {
        $role = Role::create([
            'name' => 'employer',
            'description' => 'Majikan',
            'permissions' => [Permission::REGISTRATION_VIEW],
        ]);

        $rahman = User::factory()->create([
            'email' => 'rahman@tenagamurni.com.my',
            'name' => 'Rahman bin Abdullah',
            'role' => 'employer',
            'role_id' => $role->id,
            'is_active' => true,
        ]);

        StRegistrationApplication::create([
            'code' => 'rg-ce-mine',
            'module_code' => 'RG-CE',
            'ref_no' => 'ST/RG-CE/2026/00901',
            'app_type' => 'new_registration',
            'applicant_name' => 'Tenaga Murni Sdn Bhd',
            'identity_no' => '200801012345 (812345-A)',
            'category_or_class' => 'C',
            'status' => 'sos_review',
            'submitted_at' => now()->subDay(),
            'stage_entered_at' => now()->subHours(5),
            'sla_target_hours' => 24,
            'employer_name' => 'Tenaga Murni Sdn Bhd',
            'detail' => [
                'applicantPersonaId' => 'p-rahman',
                'employerId' => 'emp-tenaga-murni',
            ],
        ]);

        StRegistrationApplication::create([
            'code' => 'rg-ce-other',
            'module_code' => 'RG-CE',
            'ref_no' => 'ST/RG-CE/2026/00902',
            'app_type' => 'new_registration',
            'applicant_name' => 'Syarikat Elektrik Maju Sdn Bhd',
            'identity_no' => '201501012345 (1122334-A)',
            'category_or_class' => 'B',
            'status' => 'technical_review',
            'submitted_at' => now()->subDays(2),
            'stage_entered_at' => now()->subHours(10),
            'sla_target_hours' => 72,
            'detail' => [
                'applicantPersonaId' => 'p-lim',
                'employerId' => 'emp-elektrik-maju',
            ],
        ]);

        $this->actingAs($rahman)
            ->getJson('/api/st/registration-applications?module_code=RG-CE')
            ->assertStatus(200)
            ->assertJsonPath('meta.total', 1)
            ->assertJsonPath('data.0.code', 'rg-ce-mine')
            ->assertJsonPath('data.0.applicantName', 'Tenaga Murni Sdn Bhd');
    }

    public function test_abc_elektrik_employer_sees_only_own_ce_apps(): void
    {
        $role = Role::create([
            'name' => 'employer',
            'description' => 'Majikan',
            'permissions' => [Permission::REGISTRATION_VIEW],
        ]);

        $faizal = User::factory()->create([
            'email' => 'faizal@abcelektrik.com.my',
            'name' => 'Ahmad Faizal bin Omar',
            'role' => 'employer',
            'role_id' => $role->id,
            'is_active' => true,
        ]);

        StRegistrationApplication::create([
            'code' => 'rg-ce-abc-1',
            'module_code' => 'RG-CE',
            'ref_no' => 'ST/RG-CE/2026/00910',
            'app_type' => 'new_registration',
            'applicant_name' => 'ABC Elektrik Sdn Bhd',
            'identity_no' => '201901089012 (1289012-H)',
            'category_or_class' => 'B',
            'status' => 'sos_review',
            'submitted_at' => now()->subDay(),
            'stage_entered_at' => now()->subHours(5),
            'sla_target_hours' => 24,
            'employer_name' => 'ABC Elektrik Sdn Bhd',
            'detail' => [
                'applicantPersonaId' => 'p-faizal',
                'employerId' => 'emp-abc-elektrik',
            ],
        ]);

        StRegistrationApplication::create([
            'code' => 'rg-ce-abc-2',
            'module_code' => 'RG-CE',
            'ref_no' => 'ST/RG-CE/2026/00911',
            'app_type' => 'renewal',
            'applicant_name' => 'ABC Elektrik Sdn Bhd',
            'identity_no' => '201901089012 (1289012-H)',
            'category_or_class' => 'B',
            'status' => 'awaiting_registration_payment',
            'submitted_at' => now()->subDays(3),
            'stage_entered_at' => now()->subHours(12),
            'sla_target_hours' => 72,
            'employer_name' => 'ABC Elektrik Sdn Bhd',
            'detail' => [
                'applicantPersonaId' => 'p-faizal',
                'employerId' => 'emp-abc-elektrik',
            ],
        ]);

        StRegistrationApplication::create([
            'code' => 'rg-ce-other-org',
            'module_code' => 'RG-CE',
            'ref_no' => 'ST/RG-CE/2026/00912',
            'app_type' => 'new_registration',
            'applicant_name' => 'Syarikat Elektrik Maju Sdn Bhd',
            'identity_no' => '201501012345 (1122334-A)',
            'category_or_class' => 'B',
            'status' => 'technical_review',
            'submitted_at' => now()->subDays(2),
            'stage_entered_at' => now()->subHours(10),
            'sla_target_hours' => 72,
            'detail' => [
                'applicantPersonaId' => 'p-lim',
                'employerId' => 'emp-elektrik-maju',
            ],
        ]);

        $this->actingAs($faizal)
            ->getJson('/api/st/registration-applications?module_code=RG-CE')
            ->assertStatus(200)
            ->assertJsonPath('meta.total', 2)
            ->assertJsonFragment(['applicantName' => 'ABC Elektrik Sdn Bhd'])
            ->assertJsonMissing(['code' => 'rg-ce-other-org']);
    }

    public function test_employer_cannot_show_other_organisation_app(): void
    {
        $role = Role::create([
            'name' => 'employer',
            'description' => 'Majikan',
            'permissions' => [Permission::REGISTRATION_VIEW],
        ]);

        $rahman = User::factory()->create([
            'email' => 'rahman@tenagamurni.com.my',
            'name' => 'Rahman bin Abdullah',
            'role' => 'employer',
            'role_id' => $role->id,
            'is_active' => true,
        ]);

        $other = StRegistrationApplication::create([
            'code' => 'rg-ce-other-2',
            'module_code' => 'RG-CE',
            'ref_no' => 'ST/RG-CE/2026/00903',
            'app_type' => 'new_registration',
            'applicant_name' => 'Voltworks Engineering Sdn Bhd',
            'identity_no' => '201201098765',
            'category_or_class' => 'A',
            'status' => 'pending_approval',
            'submitted_at' => now(),
            'stage_entered_at' => now(),
            'sla_target_hours' => 48,
            'detail' => [
                'applicantPersonaId' => 'p-lim',
                'employerId' => 'emp-elektrik-maju',
            ],
        ]);

        $this->actingAs($rahman)
            ->getJson('/api/st/registration-applications/'.$other->id)
            ->assertStatus(404)
            ->assertJsonPath('error.code', 'NOT_FOUND');
    }

    public function test_employer_can_confirm_ok_appointment_status(): void
    {
        $role = Role::create([
            'name' => 'employer',
            'description' => 'Majikan',
            'permissions' => [
                Permission::REGISTRATION_VIEW,
                Permission::REGISTRATION_EDIT,
            ],
        ]);

        $faizal = User::factory()->create([
            'email' => 'faizal@abcelektrik.com.my',
            'name' => 'Ahmad Faizal bin Omar',
            'role' => 'employer',
            'role_id' => $role->id,
            'is_active' => true,
        ]);

        $app = StRegistrationApplication::create([
            'code' => 'rg-ke-aisyah-confirm',
            'module_code' => 'RG-KE',
            'ref_no' => 'ST/RG-KE/2026/00345',
            'app_type' => 'new_registration',
            'applicant_name' => 'Nur Aisyah binti Hassan',
            'identity_no' => '920814-14-5688',
            'category_or_class' => 'PW',
            'status' => 'awaiting_employer_confirm',
            'submitted_at' => now(),
            'stage_entered_at' => now(),
            'sla_target_hours' => 48,
            'employer_name' => 'ABC Elektrik Sdn Bhd',
            'detail' => [
                'applicantPersonaId' => 'p-aisyah',
                'employerId' => 'emp-abc-elektrik',
                'employerCategory' => 'company',
                'email' => 'aisyah.hassan@email.my',
            ],
        ]);

        $this->actingAs($faizal)
            ->putJson('/api/st/registration-applications/'.$app->id, [
                'status' => 'awaiting_processing_payment',
                'stageEnteredAt' => now()->toIso8601String(),
                'detail' => [
                    'applicantPersonaId' => 'p-aisyah',
                    'employerId' => 'emp-abc-elektrik',
                    'employerCategory' => 'company',
                    'email' => 'aisyah.hassan@email.my',
                    'timeline' => [
                        ['at' => now()->toIso8601String(), 'label' => 'Lantikan disahkan majikan', 'actor' => 'Ahmad Faizal bin Omar'],
                    ],
                ],
            ])
            ->assertStatus(200)
            ->assertJsonPath('data.status', 'awaiting_processing_payment')
            ->assertJsonPath('data.applicantName', 'Nur Aisyah binti Hassan');

        $this->assertDatabaseHas('st_registration_applications', [
            'id' => $app->id,
            'status' => 'awaiting_processing_payment',
        ]);
    }

    public function test_applicant_can_persist_processing_payment_status(): void
    {
        $role = Role::create([
            'name' => 'applicant',
            'description' => 'Pemohon',
            'permissions' => [
                Permission::REGISTRATION_VIEW,
                Permission::REGISTRATION_CREATE,
                Permission::REGISTRATION_EDIT,
            ],
        ]);

        $aisyah = User::factory()->create([
            'email' => 'aisyah.hassan@email.my',
            'name' => 'Nur Aisyah binti Hassan',
            'role' => 'applicant',
            'role_id' => $role->id,
            'is_active' => true,
        ]);

        $own = StRegistrationApplication::create([
            'code' => 'rg-ke-aisyah-pay',
            'module_code' => 'RG-KE',
            'ref_no' => 'ST/RG-KE/2026/00350',
            'app_type' => 'new_registration',
            'applicant_name' => 'Nur Aisyah binti Hassan',
            'identity_no' => '920814-14-5688',
            'category_or_class' => 'PW',
            'status' => 'awaiting_processing_payment',
            'submitted_at' => now(),
            'stage_entered_at' => now(),
            'sla_target_hours' => 72,
            'employer_name' => 'ABC Elektrik Sdn Bhd',
            'detail' => [
                'applicantPersonaId' => 'p-aisyah',
                'employerId' => 'emp-abc-elektrik',
                'email' => 'aisyah.hassan@email.my',
            ],
        ]);

        $other = StRegistrationApplication::create([
            'code' => 'rg-ke-other-pay',
            'module_code' => 'RG-KE',
            'ref_no' => 'ST/RG-KE/2026/00351',
            'app_type' => 'new_registration',
            'applicant_name' => 'Ahmad bin Ismail',
            'identity_no' => '850101-10-5432',
            'category_or_class' => 'PW4',
            'status' => 'awaiting_processing_payment',
            'submitted_at' => now(),
            'stage_entered_at' => now(),
            'sla_target_hours' => 72,
            'detail' => [
                'applicantPersonaId' => 'p-ahmad',
                'email' => 'ahmad.ismail@email.my',
            ],
        ]);

        $this->actingAs($aisyah)
            ->putJson('/api/st/registration-applications/'.$own->id, [
                'status' => 'sos_review',
                'stageEnteredAt' => now()->toIso8601String(),
            ])
            ->assertStatus(200)
            ->assertJsonPath('data.status', 'sos_review');

        $this->actingAs($aisyah)
            ->putJson('/api/st/registration-applications/'.$other->id, [
                'status' => 'sos_review',
            ])
            ->assertStatus(404);

        $this->actingAs($aisyah)
            ->getJson('/api/st/registration-applications')
            ->assertStatus(200)
            ->assertJsonPath('meta.total', 1)
            ->assertJsonFragment(['code' => 'rg-ke-aisyah-pay'])
            ->assertJsonMissing(['code' => 'rg-ke-other-pay']);
    }

    public function test_appointed_ok_can_confirm_ce_appointment_status(): void
    {
        $role = Role::create([
            'name' => 'applicant',
            'description' => 'Pemohon',
            'permissions' => [
                Permission::REGISTRATION_VIEW,
                Permission::REGISTRATION_CREATE,
                Permission::REGISTRATION_EDIT,
            ],
        ]);

        $rizal = User::factory()->create([
            'email' => 'rizal.hassan@email.my',
            'name' => 'Rizal bin Hassan',
            'role' => 'applicant',
            'role_id' => $role->id,
            'is_active' => true,
        ]);

        $app = StRegistrationApplication::create([
            'code' => 'rg-ce-na03',
            'module_code' => 'RG-CE',
            'ref_no' => 'ST/RG-CE/2026/00964',
            'app_type' => 'new_registration',
            'applicant_name' => 'Tenaga Murni Sdn Bhd',
            'identity_no' => '200801012345 (812345-A)',
            'category_or_class' => 'C',
            'status' => 'awaiting_employer_confirm',
            'submitted_at' => now(),
            'stage_entered_at' => now(),
            'sla_target_hours' => 336,
            'employer_name' => 'Tenaga Murni Sdn Bhd',
            'detail' => [
                'applicantPersonaId' => 'p-rahman',
                'employerId' => 'emp-tenaga-murni',
                'ce' => [
                    'companyName' => 'Tenaga Murni Sdn Bhd',
                    'appointedOks' => [
                        [
                            'okId' => 'ok-rizal-rg-ce-na03-0',
                            'registeredOkId' => 'ok-rizal',
                            'name' => 'Rizal bin Hassan',
                            'mykad' => '870404-10-5512',
                            'wirerType' => 'PW4',
                            'personaId' => 'p-rizal',
                            'confirmed' => false,
                        ],
                    ],
                ],
            ],
        ]);

        $this->actingAs($rizal)
            ->getJson('/api/st/registration-applications/by-code/rg-ce-na03')
            ->assertStatus(200)
            ->assertJsonPath('data.code', 'rg-ce-na03');

        $this->actingAs($rizal)
            ->putJson('/api/st/registration-applications/'.$app->id, [
                'status' => 'awaiting_processing_payment',
                'stageEnteredAt' => now()->toIso8601String(),
                'detail' => [
                    'applicantPersonaId' => 'p-rahman',
                    'employerId' => 'emp-tenaga-murni',
                    'ce' => [
                        'companyName' => 'Tenaga Murni Sdn Bhd',
                        'appointedOks' => [
                            [
                                'okId' => 'ok-rizal-rg-ce-na03-0',
                                'registeredOkId' => 'ok-rizal',
                                'name' => 'Rizal bin Hassan',
                                'mykad' => '870404-10-5512',
                                'wirerType' => 'PW4',
                                'personaId' => 'p-rizal',
                                'confirmed' => true,
                            ],
                        ],
                    ],
                ],
            ])
            ->assertStatus(200)
            ->assertJsonPath('data.status', 'awaiting_processing_payment');

        $this->assertDatabaseHas('st_registration_applications', [
            'id' => $app->id,
            'status' => 'awaiting_processing_payment',
        ]);
    }
}
