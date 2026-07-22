<?php

namespace Tests\Feature;

use App\Enums\Permission;
use App\Mail\ApplicantRejectionMail;
use App\Models\Role;
use App\Models\User;
use App\Services\StaffTaskLinkService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class ApplicantRejectionEmailTest extends TestCase
{
    use RefreshDatabase;

    private function editorWithPermission(): User
    {
        $role = Role::query()->create([
            'name' => 'approver-rejection-test',
            'description' => 'test',
            'permissions' => [Permission::REGISTRATION_EDIT],
        ]);

        $user = User::factory()->create(['is_active' => true]);
        $user->forceFill(['role_id' => $role->id])->save();

        return $user;
    }

    private function assertOpaqueActionUrl(string $actionUrl, string $expectedInternalPath): void
    {
        $this->assertMatchesRegularExpression(
            '#^http://localhost:5180/st/go/[A-Za-z0-9_-]+$#',
            $actionUrl,
            'Email deep-link must hide folder/id behind an opaque /st/go/{token} path'
        );
        $this->assertStringNotContainsString('/applications/', $actionUrl);

        $token = substr($actionUrl, strrpos($actionUrl, '/') + 1);
        $this->assertSame($expectedInternalPath, app(StaffTaskLinkService::class)->revealPath($token));
    }

    public function test_applicant_rejection_notify_sends_to_simulation_override(): void
    {
        Mail::fake();
        config([
            'st.staff_mail_override' => 'masri.yakop@gmail.com',
            'st.frontend_url' => 'http://localhost:5180',
        ]);

        $user = $this->editorWithPermission();

        $this->actingAs($user)->postJson('/api/st/applicant-rejection-notify', [
            'applicant_email' => 'ahmad.ismail@email.my',
            'note' => 'Dokumen tidak lengkap. Permohonan ditolak.',
            'ref_no' => 'ST/OK/2026/00301',
            'applicant_name' => 'Ahmad bin Ismail',
            'module_code' => 'RG-KE',
            'application_code' => 'app-301',
            'action_path' => '/st/applications/app-301?stage=rejected',
        ])->assertStatus(200)
            ->assertJsonPath('data.success', true);

        Mail::assertSent(ApplicantRejectionMail::class, function (ApplicantRejectionMail $mail) {
            $this->assertSame('ST/OK/2026/00301', $mail->payload['ref_no']);
            $this->assertSame('ahmad.ismail@email.my', $mail->payload['intended_email']);
            $this->assertStringContainsString('Dokumen tidak lengkap', $mail->payload['note']);
            $this->assertOpaqueActionUrl(
                $mail->payload['action_url'],
                '/st/applications/app-301?stage=rejected'
            );
            $this->assertSame(
                'Permohonan ditolak: ST/OK/2026/00301',
                $mail->envelope()->subject
            );

            return $mail->hasTo('masri.yakop@gmail.com');
        });
    }

    public function test_applicant_rejection_notify_uses_applicant_email_without_override(): void
    {
        Mail::fake();
        config([
            'st.staff_mail_override' => null,
            'st.frontend_url' => 'http://localhost:5180',
        ]);

        $user = $this->editorWithPermission();

        $this->actingAs($user)->postJson('/api/st/applicant-rejection-notify', [
            'applicant_email' => 'ahmad.ismail@email.my',
            'note' => 'Permohonan ditolak.',
            'ref_no' => 'ST/OK/2026/00302',
            'application_code' => 'app-302',
        ])->assertStatus(200);

        Mail::assertSent(ApplicantRejectionMail::class, function (ApplicantRejectionMail $mail) {
            $this->assertNull($mail->payload['intended_email']);

            return $mail->hasTo('ahmad.ismail@email.my');
        });
    }

    public function test_applicant_rejection_notify_allows_empty_note(): void
    {
        Mail::fake();
        config([
            'st.staff_mail_override' => 'masri.yakop@gmail.com',
            'st.frontend_url' => 'http://localhost:5180',
        ]);

        $user = $this->editorWithPermission();

        $this->actingAs($user)->postJson('/api/st/applicant-rejection-notify', [
            'applicant_email' => 'ahmad.ismail@email.my',
            'ref_no' => 'ST/OK/2026/00303',
        ])->assertStatus(200);

        Mail::assertSent(ApplicantRejectionMail::class, function (ApplicantRejectionMail $mail) {
            $this->assertNotSame('', $mail->payload['note']);

            return $mail->hasTo('masri.yakop@gmail.com');
        });
    }

    public function test_applicant_rejection_notify_validation_error(): void
    {
        Mail::fake();
        $user = $this->editorWithPermission();

        $this->actingAs($user)->postJson('/api/st/applicant-rejection-notify', [
            'applicant_email' => 'not-an-email',
        ])->assertStatus(422)
            ->assertJsonPath('error.code', 'VALIDATION_ERROR');

        Mail::assertNothingSent();
    }

    public function test_applicant_rejection_notify_requires_auth(): void
    {
        Mail::fake();

        $this->postJson('/api/st/applicant-rejection-notify', [
            'applicant_email' => 'ahmad.ismail@email.my',
            'note' => 'Ditolak.',
        ])->assertStatus(401);

        Mail::assertNothingSent();
    }

    public function test_applicant_rejection_notify_requires_registration_edit(): void
    {
        Mail::fake();

        $role = Role::query()->create([
            'name' => 'viewer-no-edit-rejection',
            'description' => 'test',
            'permissions' => [Permission::REGISTRATION_VIEW],
        ]);
        $user = User::factory()->create(['is_active' => true]);
        $user->forceFill(['role_id' => $role->id])->save();

        $this->actingAs($user)->postJson('/api/st/applicant-rejection-notify', [
            'applicant_email' => 'ahmad.ismail@email.my',
            'note' => 'Ditolak.',
        ])->assertStatus(403);

        Mail::assertNothingSent();
    }
}
