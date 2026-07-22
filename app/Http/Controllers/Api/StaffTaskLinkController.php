<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Services\StaffTaskLinkService;
use Illuminate\Http\JsonResponse;

class StaffTaskLinkController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected StaffTaskLinkService $links,
    ) {}

    /**
     * Resolve an opaque /st/go/{token} deep-link to an internal SPA path.
     */
    public function show(string $token): JsonResponse
    {
        $path = $this->links->revealPath($token);
        if ($path === null) {
            return $this->sendError(404, 'NOT_FOUND', 'Task link is invalid or has expired');
        }

        return $this->sendOk(['path' => $path]);
    }
}
