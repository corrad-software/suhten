<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use RuntimeException;

/**
 * Design-time helper: translate natural language into a ConditionAction expression.
 */
class AnthropicConditionTranslator
{
    private const SYSTEM_PROMPT = <<<'PROMPT'
You translate natural-language workflow rules into a single condition expression for ConditionAction.

Output rules:
- Reply with ONLY the expression string. No explanation, quotes, or markdown.
- Allowed operators: =, !=, >, <, >=, <=, is, is not
- Never use === or !==
- Use dot paths for nested data (e.g. user.plan, order.total)
- Prefer = or is for equality
- Examples: user.plan = premium | order.total > 100 | status != rejected | review.approved
PROMPT;

    /**
     * @throws RuntimeException
     */
    public function translate(string $naturalLanguage): string
    {
        $apiKey = config('services.anthropic.key');
        if (! is_string($apiKey) || trim($apiKey) === '') {
            throw new RuntimeException('Anthropic API key is not configured.');
        }

        $baseUrl = rtrim((string) config('services.anthropic.base_url', 'https://api.anthropic.com'), '/');
        $model = (string) config('services.anthropic.model', 'claude-haiku-4-5');

        $response = Http::withHeaders([
            'x-api-key' => $apiKey,
            'anthropic-version' => '2023-06-01',
            'content-type' => 'application/json',
        ])
            ->timeout(30)
            ->post("{$baseUrl}/v1/messages", [
                'model' => $model,
                'max_tokens' => 128,
                'system' => self::SYSTEM_PROMPT,
                'messages' => [
                    [
                        'role' => 'user',
                        'content' => "Translate this rule:\n{$naturalLanguage}",
                    ],
                ],
            ]);

        if (! $response->successful()) {
            $message = $response->json('error.message')
                ?? $response->body()
                ?: 'Anthropic request failed.';

            throw new RuntimeException(is_string($message) ? $message : 'Anthropic request failed.');
        }

        $text = $this->extractText($response->json());
        $expression = $this->normalizeExpression($text);

        if ($expression === '') {
            throw new RuntimeException('Anthropic returned an empty condition expression.');
        }

        return $expression;
    }

    /**
     * @param  array<string, mixed>|null  $payload
     */
    private function extractText(?array $payload): string
    {
        $blocks = $payload['content'] ?? [];
        if (! is_array($blocks)) {
            return '';
        }

        $parts = [];
        foreach ($blocks as $block) {
            if (is_array($block) && ($block['type'] ?? null) === 'text' && isset($block['text'])) {
                $parts[] = (string) $block['text'];
            }
        }

        return trim(implode("\n", $parts));
    }

    private function normalizeExpression(string $text): string
    {
        $text = trim($text);
        $text = preg_replace('/^```(?:\w+)?\s*/', '', $text) ?? $text;
        $text = preg_replace('/\s*```$/', '', $text) ?? $text;
        $text = trim($text, " \t\n\r\0\x0B\"'`");

        // Keep only the first line if the model added commentary.
        $firstLine = strtok($text, "\n");

        return is_string($firstLine) ? trim($firstLine) : '';
    }
}
