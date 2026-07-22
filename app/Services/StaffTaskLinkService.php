<?php

namespace App\Services;

use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Support\Facades\Crypt;
use Throwable;

/**
 * Opaque email deep-links for staff workflow tasks.
 *
 * Encrypts the internal SPA path (folder + application id/query) so emails
 * never expose raw URLs like /st/applications/app-326?stage=pending_approval.
 */
class StaffTaskLinkService
{
    private const TTL_DAYS = 14;

    /**
     * Build a frontend URL whose path segment hides the real destination.
     * Example: http://localhost:5180/st/go/{encryptedToken}
     */
    public function sealUrl(string $frontendBase, string $internalPath): string
    {
        $frontend = rtrim($frontendBase, '/');
        $path = $this->normalizeInternalPath($internalPath);
        if ($path === null) {
            return $frontend.'/st/inbox';
        }

        return $frontend.'/st/go/'.$this->encryptPath($path);
    }

    /**
     * Decrypt a token from /st/go/{token} back to an internal /st… path.
     */
    public function revealPath(string $token): ?string
    {
        $token = trim($token);
        if ($token === '' || ! preg_match('/^[A-Za-z0-9_-]+$/', $token)) {
            return null;
        }

        try {
            $json = Crypt::decryptString($this->fromUrlSafe($token));
            $payload = json_decode($json, true);
            if (! is_array($payload)) {
                return null;
            }

            $expiresAt = isset($payload['e']) && is_numeric($payload['e'])
                ? (int) $payload['e']
                : 0;
            if ($expiresAt > 0 && $expiresAt < time()) {
                return null;
            }

            $path = is_string($payload['p'] ?? null) ? $payload['p'] : null;

            return $this->normalizeInternalPath($path ?? '');
        } catch (DecryptException|Throwable) {
            return null;
        }
    }

    public function encryptPath(string $internalPath): string
    {
        $payload = json_encode([
            'p' => $internalPath,
            'e' => now()->addDays(self::TTL_DAYS)->getTimestamp(),
        ], JSON_THROW_ON_ERROR);

        return $this->toUrlSafe(Crypt::encryptString($payload));
    }

    private function normalizeInternalPath(string $path): ?string
    {
        $path = trim($path);
        if ($path === '' || ! str_starts_with($path, '/st') || str_starts_with($path, '//')) {
            return null;
        }

        // Disallow scheme-relative / host injection in the sealed path.
        if (str_contains($path, '://') || str_contains($path, "\n") || str_contains($path, "\r")) {
            return null;
        }

        return $path;
    }

    private function toUrlSafe(string $value): string
    {
        return rtrim(strtr($value, '+/', '-_'), '=');
    }

    private function fromUrlSafe(string $value): string
    {
        $remainder = strlen($value) % 4;

        return strtr($value, '-_', '+/').($remainder ? str_repeat('=', 4 - $remainder) : '');
    }
}
