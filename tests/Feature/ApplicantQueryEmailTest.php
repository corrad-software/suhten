<?php

namespace Tests\Feature;

use App\Enums\Permission;
use App\Mail\ApplicantQueryMail;
use App\Models\Role;
use App\Models\User;
use App\Services\StaffTaskLinkService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class ApplicantQueryEmailTest extends TestCase
{
    use RefreshDatabase;

    private function editorWithPermission(): User
    {
        $role = Role::query()->create([
            'name' => 'sos-applicant-query-test',
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

    public function test_applicant_query_notify_sends_to_simulation_override(): void
    {
        Mail::fake();
        config([
            'st.staff_mail_override' => 'masri.yakop@gmail.com',
            'st.frontend_url' => 'http://localhost:5180',
        ]);

        $user = $this->editorWithPermission();

        $this->actingAs($user)->postJson('/api/st/applicant-query-notify', [
            'applicant_email' => 'ahmad.ismail@email.my',
            'note' => 'Salinan MyKad dilampirkan kurang jelas. Sila kemaskini permohonan dan muat naik salinan MyKad yg jelas.',
            'ref_no' => 'ST/OK/2026/00107',
            'applicant_name' => 'Ahmad bin Ismail',
            'module_code' => 'RG-KE',
            'application_code' => 'app-107',
            'action_path' => '/st/applications/app-107?stage=query_applicant',
        ])->assertStatus(200)
            ->assertJsonPath('data.success', true);

        Mail::assertSent(ApplicantQueryMail::class, function (ApplicantQueryMail $mail) {
            $this->assertSame('ST/OK/2026/00107', $mail->payload['ref_no']);
            $this->assertSame('ahmad.ismail@email.my', $mail->payload['intended_email']);
            $this->assertStringContainsString('MyKad', $mail->payload['note']);
            $this->assertOpaqueActionUrl(
                $mail->payload['action_url'],
                '/st/applications/app-107?stage=query_applicant'
            );
            $this->assertSame(
                'Pertanyaan permohonan: ST/OK/2026/00107',
                $mail->envelope()->subject
            );

            return $mail->hasTo('masri.yakop@gmail.com');
        });
    }

    public function test_applicant_query_notify_uses_applicant_email_without_override(): void
    {
        Mail::fake();
        config([
            'st.staff_mail_override' => null,
            'st.frontend_url' => 'http://localhost:5180',
        ]);

        $user = $this->editorWithPermission();

        $this->actingAs($user)->postJson('/api/st/applicant-query-notify', [
            'applicant_email' => 'ahmad.ismail@email.my',
            'note' => 'Sila kemaskini dokumen.',
            'ref_no' => 'ST/OK/2026/00108',
            'application_code' => 'app-108',
        ])->assertStatus(200);

        Mail::assertSent(ApplicantQueryMail::class, function (ApplicantQueryMail $mail) {
            $this->assertNull($mail->payload['intended_email']);

            return $mail->hasTo('ahmad.ismail@email.my');
        });
    }

    public function test_applicant_query_notify_validation_error(): void
    {
        Mail::fake();
        $user = $this->editorWithPermission();

        $this->actingAs($user)->postJson('/api/st/applicant-query-notify', [
            'applicant_email' => 'not-an-email',
        ])->assertStatus(422)
            ->assertJsonPath('error.code', 'VALIDATION_ERROR');

        Mail::assertNothingSent();
    }

    public function test_applicant_query_notify_requires_auth(): void
    {
        Mail::fake();

        $this->postJson('/api/st/applicant-query-notify', [
            'applicant_email' => 'ahmad.ismail@email.my',
            'note' => 'Sila kemaskini.',
        ])->assertStatus(401);

        Mail::assertNothingSent();
    }

    public function test_applicant_query_notify_requires_registration_edit(): void
    {
        Mail::fake();

        $role = Role::query()->create([
            'name' => 'viewer-no-edit',
            'description' => 'test',
            'permissions' => [Permission::REGISTRATION_VIEW],
        ]);
        $user = User::factory()->create(['is_active' => true]);
        $user->forceFill(['role_id' => $role->id])->save();

        $this->actingAs($user)->postJson('/api/st/applicant-query-notify', [
            'applicant_email' => 'ahmad.ismail@email.my',
            'note' => 'Sila kemaskini.',
        ])->assertStatus(403);

        Mail::assertNothingSent();
    }
}
