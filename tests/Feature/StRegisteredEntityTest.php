<?php

namespace Tests\Feature;

use App\Enums\Permission;
use App\Models\Role;
use App\Models\StRegisteredEntity;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StRegisteredEntityTest extends TestCase
{
    use RefreshDatabase;

    private function userWithPermissions(array $permissions): User
    {
        $role = Role::create([
            'name' => 'test-ent-'.uniqid(),
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
        $this->getJson('/api/st/registered-entities')
            ->assertStatus(401);
    }

    public function test_index_forbidden_without_permission(): void
    {
        $this->actingAs($this->userWithPermissions([]));

        $this->getJson('/api/st/registered-entities')
            ->assertStatus(403)
            ->assertJsonPath('error.code', 'FORBIDDEN');
    }

    public function test_index_returns_entities(): void
    {
        $this->actingAs($this->userWithPermissions([Permission::REGISTRATION_VIEW]));

        StRegisteredEntity::create([
            'code' => 'ent-ke-1',
            'module_code' => 'RG-KE',
            'certificate_no' => 'OK-E/PW4/2024/00821',
            'holder_name' => 'Ahmad bin Ismail',
            'identity_no' => '850101-10-5432',
            'category_or_class' => 'PW4',
            'registered_at' => now()->subDays(400),
            'expires_at' => now()->addDays(45),
            'compliance' => 'expiring_soon',
            'cdp_points' => 22,
        ]);

        $this->getJson('/api/st/registered-entities?module_code=RG-KE')
            ->assertStatus(200)
            ->assertJsonPath('meta.total', 1)
            ->assertJsonPath('data.0.certificateNo', 'OK-E/PW4/2024/00821');
    }

    public function test_store_validation_error(): void
    {
        $this->actingAs($this->userWithPermissions([Permission::REGISTRATION_CREATE]));

        $this->postJson('/api/st/registered-entities', [])
            ->assertStatus(422)
            ->assertJsonPath('error.code', 'VALIDATION_ERROR');
    }
}
