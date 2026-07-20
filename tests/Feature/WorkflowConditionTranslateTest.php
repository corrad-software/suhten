<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class WorkflowConditionTranslateTest extends TestCase
{
    use RefreshDatabase;

    private function authUser(): User
    {
        return User::factory()->create(['is_active' => true]);
    }

    public function test_translate_requires_authentication(): void
    {
        $this->postJson('/api/workflows/translate-condition', [
            'natural_language' => 'If the user plan is premium',
        ])->assertStatus(401);
    }

    public function test_catalog_includes_condition_ai(): void
    {
        $this->actingAs($this->authUser());

        $response = $this->getJson('/api/workflows/catalog')
            ->assertStatus(200);

        $keys = collect($response->json('data.actions'))->pluck('key')->all();

        $this->assertContains('condition_ai', $keys);
    }

    public function test_translate_validation_requires_natural_language(): void
    {
        $this->actingAs($this->authUser());

        $this->postJson('/api/workflows/translate-condition', [])
            ->assertStatus(422)
            ->assertJsonPath('error.code', 'VALIDATION_ERROR');
    }

    public function test_translate_returns_condition_expression(): void
    {
        config([
            'services.anthropic.key' => 'test-key',
            'services.anthropic.model' => 'claude-haiku-4-5',
            'services.anthropic.base_url' => 'https://api.anthropic.com',
        ]);

        Http::fake([
            'api.anthropic.com/*' => Http::response([
                'content' => [
                    ['type' => 'text', 'text' => 'user.plan = premium'],
                ],
            ], 200),
        ]);

        $this->actingAs($this->authUser());

        $this->postJson('/api/workflows/translate-condition', [
            'natural_language' => 'If the user plan is premium',
        ])
            ->assertStatus(200)
            ->assertJsonPath('data.condition', 'user.plan = premium');

        Http::assertSent(function ($request) {
            return $request->url() === 'https://api.anthropic.com/v1/messages'
                && $request->hasHeader('x-api-key', 'test-key')
                && $request['model'] === 'claude-haiku-4-5';
        });
    }

    public function test_translate_returns_503_when_api_key_missing(): void
    {
        config([
            'services.anthropic.key' => '',
            'services.anthropic.model' => 'claude-haiku-4-5',
        ]);

        $this->actingAs($this->authUser());

        $this->postJson('/api/workflows/translate-condition', [
            'natural_language' => 'If the user plan is premium',
        ])
            ->assertStatus(503)
            ->assertJsonPath('error.code', 'AI_TRANSLATION_UNAVAILABLE');
    }

    public function test_can_create_workflow_with_condition_ai_step(): void
    {
        $this->actingAs($this->authUser());

        $this->postJson('/api/workflows', [
            'name' => 'AI Condition Flow',
            'steps' => [
                [
                    'id' => 'check-plan',
                    'name' => 'Condition AI',
                    'action_key' => 'condition_ai',
                    'parameters' => [
                        'natural_language' => 'If the user plan is premium',
                        'condition' => 'user.plan = premium',
                    ],
                ],
            ],
        ])
            ->assertStatus(201)
            ->assertJsonPath('data.name', 'AI Condition Flow');
    }
}
