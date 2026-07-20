<?php

namespace Tests\Feature;

use App\Mail\StaffWorkflowTaskMail;
use App\Models\User;
use App\Models\WorkflowDefinition;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class StaffWorkflowTaskEmailTest extends TestCase
{
    use RefreshDatabase;

    private function authUser(): User
    {
        return User::factory()->create(['is_active' => true]);
    }

    public function test_sos_waiting_sends_email_to_simulation_override(): void
    {
        Mail::fake();
        config([
            'st.staff_mail_override' => 'masri.yakop@gmail.com',
            'st.frontend_url' => 'http://localhost:5180',
        ]);

        User::factory()->create([
            'name' => 'Faridah binti Hassan',
            'email' => 'faridah.hassan@st.gov.my',
            'role' => 'sos',
            'is_active' => true,
        ]);

        $user = $this->authUser();
        $definition = WorkflowDefinition::create([
            'name' => 'Staff Mail Demo',
            'slug' => 'staff-mail-demo',
            'version' => '1.0',
            'description' => null,
            'is_active' => true,
            'definition' => [
                'name' => 'Staff Mail Demo',
                'version' => '1.0',
                'steps' => [
                    [
                        'id' => 'sos-review',
                        'name' => 'SOS Review',
                        'action' => 'human',
                        'parameters' => [
                            'assign_to_role' => 'sos',
                            'outcomes' => ['lengkap'],
                            'sla_hours' => 4,
                            'tab' => 'new',
                        ],
                    ],
                ],
            ],
        ]);

        $response = $this->actingAs($user)->postJson("/api/workflows/{$definition->id}/start", [
            'context' => [
                'ref_no' => 'ST/RG-KE/2026/00099',
                'applicant_name' => 'Ahmad Bin Ali',
                'module_code' => 'RG-KE',
                'application_id' => 42,
            ],
        ]);

        $response->assertStatus(200);

        Mail::assertSent(StaffWorkflowTaskMail::class, function (StaffWorkflowTaskMail $mail) {
            $this->assertSame('sos', $mail->payload['role']);
            $this->assertSame('Pegawai SOS', $mail->payload['role_label']);
            $this->assertSame('ST/RG-KE/2026/00099', $mail->payload['ref_no']);
            $this->assertSame('faridah.hassan@st.gov.my', $mail->payload['intended_email']);
            $this->assertSame(
                'http://localhost:5180/admin/st/registration/ok-electric/applications/42',
                $mail->payload['action_url']
            );
            $this->assertSame(
                'Tugasan baharu — Pegawai SOS: ST/RG-KE/2026/00099',
                $mail->envelope()->subject
            );

            return $mail->hasTo('masri.yakop@gmail.com');
        });

        // Profile email must remain unchanged
        $this->assertDatabaseHas('users', [
            'email' => 'faridah.hassan@st.gov.my',
            'role' => 'sos',
        ]);
    }

    public function test_mock_ui_notify_endpoint_sends_to_override(): void
    {
        Mail::fake();
        config([
            'st.staff_mail_override' => 'masri.yakop@gmail.com',
            'st.frontend_url' => 'http://localhost:5180',
        ]);

        User::factory()->create([
            'email' => 'kumaravel@st.gov.my',
            'role' => 'technical',
            'is_active' => true,
        ]);

        $user = User::factory()->create([
            'is_active' => true,
            'role' => 'sos',
        ]);
        // Grant registration.edit via role model permissions used by CheckPermission
        $role = \App\Models\Role::query()->create([
            'name' => 'sos-mail-test',
            'description' => 'test',
            'permissions' => [\App\Enums\Permission::REGISTRATION_EDIT],
        ]);
        $user->forceFill(['role_id' => $role->id])->save();

        $this->actingAs($user)->postJson('/api/st/staff-task-notify', [
            'role' => 'technical',
            'ref_no' => 'ST/RG-KE/2026/DEMO',
            'applicant_name' => 'Ahmad',
            'module_code' => 'RG-KE',
            'application_code' => 'app-108',
            'action_path' => '/admin/st/applications/app-108',
        ])->assertStatus(200);

        Mail::assertSent(StaffWorkflowTaskMail::class, function (StaffWorkflowTaskMail $mail) {
            $this->assertSame('technical', $mail->payload['role']);
            $this->assertSame('Pegawai Teknikal', $mail->payload['role_label']);
            $this->assertSame(
                'http://localhost:5180/admin/st/applications/app-108',
                $mail->payload['action_url']
            );
            $this->assertSame(
                'Tugasan baharu — Pegawai Teknikal: ST/RG-KE/2026/DEMO',
                $mail->envelope()->subject
            );

            return $mail->hasTo('masri.yakop@gmail.com');
        });
    }

    public function test_approver_subject_uses_pelulus_label(): void
    {
        Mail::fake();
        config(['st.staff_mail_override' => 'masri.yakop@gmail.com']);

        User::factory()->create([
            'email' => 'zainab.othman@st.gov.my',
            'name' => 'Ir. Zainab binti Othman',
            'role' => 'approver',
            'is_active' => true,
        ]);

        $ok = app(\App\Services\StaffWorkflowTaskNotifier::class)->notifyForRole('approver', [
            'ref_no' => 'ST/OK/2026/00105',
            'applicant_name' => 'Ahmad bin Ismail',
            'module_code' => 'RG-KE',
            'application_code' => 'app-105',
        ]);

        $this->assertTrue($ok);

        Mail::assertSent(StaffWorkflowTaskMail::class, function (StaffWorkflowTaskMail $mail) {
            $this->assertSame('approver', $mail->payload['role']);
            $this->assertSame('Pelulus', $mail->payload['role_label']);
            $this->assertSame(
                'Tugasan baharu — Pelulus: ST/OK/2026/00105',
                $mail->envelope()->subject
            );

            return $mail->hasTo('masri.yakop@gmail.com');
        });
    }

    public function test_employer_waiting_does_not_send_staff_email(): void
    {
        Mail::fake();
        config(['st.staff_mail_override' => 'masri.yakop@gmail.com']);

        $user = $this->authUser();
        $definition = WorkflowDefinition::create([
            'name' => 'Employer Wait Demo',
            'slug' => 'employer-wait-demo',
            'version' => '1.0',
            'description' => null,
            'is_active' => true,
            'definition' => [
                'name' => 'Employer Wait Demo',
                'version' => '1.0',
                'steps' => [
                    [
                        'id' => 'employer-confirm',
                        'name' => 'Employer Confirm',
                        'action' => 'human',
                        'parameters' => [
                            'assign_to_role' => 'employer',
                            'outcomes' => ['confirmed'],
                            'tab' => 'new',
                        ],
                    ],
                ],
            ],
        ]);

        $this->actingAs($user)->postJson("/api/workflows/{$definition->id}/start", [
            'context' => [
                'ref_no' => 'ST/RG-KE/2026/00100',
                'applicant_name' => 'Siti',
                'module_code' => 'RG-KE',
                'application_id' => 43,
            ],
        ])->assertStatus(200);

        Mail::assertNothingSent();
    }

    public function test_technical_step_sends_email_with_deep_link(): void
    {
        Mail::fake();
        config([
            'st.staff_mail_override' => 'masri.yakop@gmail.com',
            'st.frontend_url' => 'http://localhost:5180',
        ]);

        User::factory()->create([
            'email' => 'kumaravel@st.gov.my',
            'role' => 'technical',
            'is_active' => true,
        ]);

        $user = $this->authUser();
        $definition = WorkflowDefinition::create([
            'name' => 'Tech Mail Demo',
            'slug' => 'tech-mail-demo',
            'version' => '1.0',
            'description' => null,
            'is_active' => true,
            'definition' => [
                'name' => 'Tech Mail Demo',
                'version' => '1.0',
                'steps' => [
                    [
                        'id' => 'sos-review',
                        'name' => 'SOS',
                        'action' => 'human',
                        'parameters' => [
                            'assign_to_role' => 'sos',
                            'outcomes' => ['lengkap'],
                        ],
                    ],
                    [
                        'id' => 'tech-review',
                        'name' => 'Technical',
                        'action' => 'human',
                        'parameters' => [
                            'assign_to_role' => 'technical',
                            'outcomes' => ['lengkap'],
                        ],
                    ],
                ],
            ],
        ]);

        $start = $this->actingAs($user)->postJson("/api/workflows/{$definition->id}/start", [
            'context' => [
                'ref_no' => 'ST/RG-CE/2026/00001',
                'applicant_name' => 'Kontraktor ABC',
                'module_code' => 'RG-CE',
                'application_id' => 7,
            ],
        ]);
        $start->assertStatus(200);
        $instanceId = $start->json('data.instanceId') ?? $start->json('data.instance_id');

        Mail::assertSent(StaffWorkflowTaskMail::class, fn (StaffWorkflowTaskMail $m) => $m->payload['role'] === 'sos');

        Mail::fake(); // reset for next transition

        $taskId = \SolutionForest\WorkflowEngine\Laravel\Models\WorkflowTask::query()
            ->where('workflow_instance_id', $instanceId)
            ->where('assign_to_role', 'sos')
            ->value('id');

        $this->actingAs($user)->postJson("/api/workflow-tasks/{$taskId}/complete", [
            'outcome' => 'lengkap',
        ])->assertStatus(200);

        Mail::assertSent(StaffWorkflowTaskMail::class, function (StaffWorkflowTaskMail $mail) {
            $this->assertSame('technical', $mail->payload['role']);
            $this->assertSame(
                'http://localhost:5180/admin/st/registration/contractor-electric/applications/7',
                $mail->payload['action_url']
            );

            return $mail->hasTo('masri.yakop@gmail.com');
        });
    }
}
