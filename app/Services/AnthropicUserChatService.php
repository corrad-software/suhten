<?php

namespace App\Services;

use App\Models\ChatMessage;
use App\Models\ChatSession;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class AnthropicUserChatService
{
    private const MAX_HISTORY_MESSAGES = 40;

    private const MAX_TOKENS = 4096;

    /**
     * Create a local session key (Anthropic has no Assistants threads).
     */
    public function createSessionKey(): string
    {
        return 'aina_'.Str::uuid()->toString();
    }

    /**
     * @param  list<string>  $imageDataUrls  data:image/...;base64,... URLs
     * @return array{content?: string, citations?: list<string>, error?: string}
     */
    public function sendMessage(
        ChatSession $session,
        string $userMessage,
        array $imageDataUrls = [],
        ?string $documentText = null,
    ): array {
        $apiKey = config('services.anthropic.key');
        if (! is_string($apiKey) || trim($apiKey) === '') {
            return ['error' => 'API key Anthropic tidak dikonfigurasi. Sila semak ANTHROPIC_API_KEY.'];
        }

        $baseUrl = rtrim((string) config('services.anthropic.base_url', 'https://api.anthropic.com'), '/');
        $model = (string) (
            config('services.anthropic.chat_model')
            ?: config('services.anthropic.model', 'claude-haiku-4-5')
        );

        $textContent = $userMessage;
        if ($documentText) {
            $textContent = "[Dokumen yang dilampirkan:\n\n{$documentText}]\n\n---\n\nSoalan pengguna: {$userMessage}";
        }

        $messages = $this->buildMessages($session, $textContent, $imageDataUrls);

        $response = Http::withHeaders([
            'x-api-key' => $apiKey,
            'anthropic-version' => '2023-06-01',
            'content-type' => 'application/json',
        ])
            ->timeout(120)
            ->post("{$baseUrl}/v1/messages", [
                'model' => $model,
                'max_tokens' => self::MAX_TOKENS,
                'system' => $this->systemPrompt($session->module_filter),
                'messages' => $messages,
            ]);

        if (! $response->successful()) {
            $body = $response->json();
            $errMsg = is_array($body)
                ? (string) ($body['error']['message'] ?? $body['error']['type'] ?? $response->body())
                : $response->body();
            Log::warning('Anthropic UserChat failed', [
                'status' => $response->status(),
                'body' => $body,
            ]);

            return ['error' => $errMsg ?: 'Anthropic request failed.'];
        }

        $text = $this->extractText($response->json());
        if ($text === '') {
            return ['error' => 'Anthropic returned an empty response.'];
        }

        return ['content' => $text, 'citations' => []];
    }

    /**
     * @param  list<string>  $imageDataUrls
     * @return list<array{role: string, content: mixed}>
     */
    private function buildMessages(ChatSession $session, string $latestUserText, array $imageDataUrls): array
    {
        $prior = ChatMessage::query()
            ->where('chat_session_id', $session->id)
            ->orderBy('created_at')
            ->orderBy('id')
            ->get();

        // Exclude the just-persisted user message; we rebuild it with optional images/docs.
        if ($prior->isNotEmpty() && $prior->last()?->role === 'user') {
            $prior = $prior->slice(0, -1)->values();
        }

        if ($prior->count() > self::MAX_HISTORY_MESSAGES) {
            $prior = $prior->slice(-self::MAX_HISTORY_MESSAGES)->values();
        }

        $messages = [];
        foreach ($prior as $msg) {
            $role = $msg->role === 'assistant' ? 'assistant' : 'user';
            $messages[] = [
                'role' => $role,
                'content' => (string) $msg->content,
            ];
        }

        $messages[] = [
            'role' => 'user',
            'content' => $this->buildUserContent($latestUserText, $imageDataUrls),
        ];

        return $this->ensureAlternatingRoles($messages);
    }

    /**
     * @param  list<string>  $imageDataUrls
     * @return string|list<array<string, mixed>>
     */
    private function buildUserContent(string $text, array $imageDataUrls): string|array
    {
        if ($imageDataUrls === []) {
            return $text;
        }

        $blocks = [
            ['type' => 'text', 'text' => $text],
        ];

        foreach (array_slice($imageDataUrls, 0, 3) as $dataUrl) {
            $parsed = $this->parseDataUrl($dataUrl);
            if ($parsed === null) {
                continue;
            }
            $blocks[] = [
                'type' => 'image',
                'source' => [
                    'type' => 'base64',
                    'media_type' => $parsed['media_type'],
                    'data' => $parsed['data'],
                ],
            ];
        }

        return count($blocks) === 1 ? $text : $blocks;
    }

    /**
     * @return array{media_type: string, data: string}|null
     */
    private function parseDataUrl(string $dataUrl): ?array
    {
        if (! preg_match('#^data:(image/(?:png|jpeg|jpg|webp|gif));base64,(.+)$#i', $dataUrl, $m)) {
            return null;
        }

        $mediaType = strtolower($m[1]);
        if ($mediaType === 'image/jpg') {
            $mediaType = 'image/jpeg';
        }

        return [
            'media_type' => $mediaType,
            'data' => $m[2],
        ];
    }

    /**
     * Anthropic requires strictly alternating user/assistant roles.
     *
     * @param  list<array{role: string, content: mixed}>  $messages
     * @return list<array{role: string, content: mixed}>
     */
    private function ensureAlternatingRoles(array $messages): array
    {
        $out = [];
        foreach ($messages as $msg) {
            $role = $msg['role'];
            $content = $msg['content'];

            if ($out !== [] && $out[array_key_last($out)]['role'] === $role) {
                $prev = &$out[array_key_last($out)];
                if (is_string($prev['content']) && is_string($content)) {
                    $prev['content'] .= "\n\n".$content;
                } else {
                    $out[] = $msg;
                }

                continue;
            }

            $out[] = $msg;
        }

        if ($out !== [] && $out[0]['role'] !== 'user') {
            array_unshift($out, ['role' => 'user', 'content' => '(permulaan perbualan)']);
        }

        return $out;
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

    private function systemPrompt(?string $moduleFilter): string
    {
        $baseUrl = rtrim((string) config('services.st.system_url', config('app.url').'/admin/st'), '/');
        $moduleHint = $moduleFilter && $moduleFilter !== 'All Modules'
            ? "\n- The user selected module filter: **{$moduleFilter}**. Prefer guidance for that module when relevant."
            : '';

        return <<<PROMPT
You are **AINA** (*AI Navigation & Innovation*) — a helpful assistant for **end users** of **Sistem Digital ST** (Suruhanjaya Tenaga digital services).

## Identity & greeting (User Chat)
- Your public name is **AINA**. On the **first user message** in a conversation, give a **brief greeting** (1–2 sentences): introduce yourself as AINA, state you help with how-to and navigation for Sistem Digital ST, and invite questions. Match the user's language (Bahasa Malaysia or English). **Do not** repeat this full greeting on every subsequent reply in the same thread.

## CRITICAL RESTRICTIONS (NEVER BREAK)
- **NEVER run SQL queries.** You do NOT have access to query the database.
- **NEVER reveal or describe database schema** (table names, columns, structure) to the user.
- Do **not** invent live transactional data (application status, payments, licence numbers). Direct the user to **Carian & Semakan Status** or support when live data is required.
- Base answers on known Sistem Digital ST procedures, menus, and documentation provided in the conversation (including attached documents). If unsure, say so clearly.

## What You CAN Do
- Answer how-to questions about licensing, registration, payments, site visits, committee approval, identity/accounts, and related ST modules
- Explain procedures, workflows, and screen navigation
- Answer in the same language the user uses (Bahasa Malaysia or English)
- Analyze attached images and document text when provided

## What You CANNOT Do
- Query live data — tell the user to use Carian & Semakan Status or contact their administrator / helpdesk
- Provide SQL or database schema information

## Menu Navigation & Links
- Base system URL: {$baseUrl}
- When you know a useful path, include it as Markdown: [Papar di sini]({$baseUrl}/...)
- Common areas: dashboard, search (Carian & Semakan Status), licensing (electric/gas), registration (OK / contractor), operations (identity, revenue, site visits, committee)
{$moduleHint}

## Diagrams — Use PlantUML (MANDATORY)
When user asks for ERD or diagrams, output PlantUML in a ```plantuml ... ``` fenced block, not ASCII art.

## Response Style
- Be helpful and concise; use clear formatting (headings, lists)
PROMPT;
    }
}
