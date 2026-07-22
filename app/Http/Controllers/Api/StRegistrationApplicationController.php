<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreStRegistrationApplicationRequest;
use App\Http\Requests\UpdateStRegistrationApplicationRequest;
use App\Http\Traits\ApiResponse;
use App\Models\StRegistrationApplication;
use App\Models\User;
use App\Services\EmployerRegistrationScope;
use App\Services\RegistrationWorkflowStarter;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class StRegistrationApplicationController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected RegistrationWorkflowStarter $workflowStarter,
        protected EmployerRegistrationScope $employerScope,
    ) {}

    /**
     * List registration applications with pagination, search, and filters.
     */
    public function index(Request $request): JsonResponse
    {
        $page = (int) $request->input('page', 1);
        $limit = (int) $request->input('limit', 50);
        $q = $request->input('q');
        $moduleCode = $request->input('module_code');
        $status = $request->input('status');
        $appType = $request->input('app_type');
        $sortBy = $request->input('sort_by', 'submitted_at');
        $sortDir = $request->input('sort_dir', 'desc');

        $allowedSort = [
            'submitted_at', 'stage_entered_at', 'created_at', 'ref_no',
            'applicant_name', 'status', 'module_code', 'id',
        ];
        if (! in_array($sortBy, $allowedSort, true)) {
            $sortBy = 'submitted_at';
        }
        $sortDir = strtolower((string) $sortDir) === 'asc' ? 'asc' : 'desc';

        $query = StRegistrationApplication::query();

        /** @var User|null $user */
        $user = $request->user();
        if ($user) {
            $query = $this->employerScope->apply($query, $user);
        }

        if ($moduleCode) {
            $query->where('module_code', $moduleCode);
        }

        if ($status) {
            $query->where('status', $status);
        }

        if ($appType) {
            $query->where('app_type', $appType);
        }

        if ($q) {
            $query->where(function ($builder) use ($q) {
                $builder->where('ref_no', 'like', "%{$q}%")
                    ->orWhere('applicant_name', 'like', "%{$q}%")
                    ->orWhere('identity_no', 'like', "%{$q}%")
                    ->orWhere('code', 'like', "%{$q}%");
            });
        }

        $total = $query->count();

        $rows = $query->orderBy($sortBy, $sortDir)
            ->skip(($page - 1) * $limit)
            ->take($limit)
            ->get();

        return $this->sendOk($rows, [
            'page' => $page,
            'limit' => $limit,
            'total' => $total,
            'totalPages' => (int) ceil($total / max($limit, 1)),
        ]);
    }

    /**
     * Create a registration application.
     */
    public function store(StoreStRegistrationApplicationRequest $request): JsonResponse
    {
        $data = $request->validated();

        if (empty($data['code'])) {
            $data['code'] = 'rg-'.Str::lower(str_replace('-', '', $data['module_code'])).'-'.Str::lower(Str::random(8));
        }

        if (empty($data['ref_no'])) {
            $data['ref_no'] = $this->nextUniqueRefNo((string) $data['module_code']);
        }

        $data['status'] = $data['status'] ?? 'draft';
        $data['sla_target_hours'] = $data['sla_target_hours'] ?? 24;
        $data['submitted_at'] = $data['submitted_at'] ?? now();
        $data['stage_entered_at'] = $data['stage_entered_at'] ?? now();

        $row = StRegistrationApplication::create($data);
        $this->workflowStarter->startForApplication($row);

        return $this->sendCreated($row->fresh());
    }

    /**
     * Allocate ST/{module}/{year}/{nnnnn} after the highest existing numeric suffix
     * (count()+1 collides with seeded gaps such as 00044 when total rows < 44).
     */
    private function nextUniqueRefNo(string $moduleCode): string
    {
        $prefix = 'ST/'.$moduleCode.'/'.now()->format('Y').'/';
        $max = 0;

        $refs = StRegistrationApplication::query()
            ->where('module_code', $moduleCode)
            ->where('ref_no', 'like', $prefix.'%')
            ->pluck('ref_no');

        foreach ($refs as $ref) {
            $tail = substr((string) $ref, strlen($prefix));
            if ($tail !== '' && ctype_digit($tail)) {
                $max = max($max, (int) $tail);
            }
        }

        for ($i = 1; $i <= 100; $i++) {
            $candidate = $prefix.str_pad((string) ($max + $i), 5, '0', STR_PAD_LEFT);
            $exists = StRegistrationApplication::query()->where('ref_no', $candidate)->exists();
            if (! $exists) {
                return $candidate;
            }
        }

        return $prefix.str_pad((string) random_int(10000, 99999), 5, '0', STR_PAD_LEFT);
    }

    /**
     * Show a single registration application.
     */
    public function show(Request $request, int $id): JsonResponse
    {
        $row = StRegistrationApplication::find($id);

        if (! $row) {
            return $this->sendError(404, 'NOT_FOUND', 'Registration application not found');
        }

        /** @var User|null $user */
        $user = $request->user();
        if ($user && ! $this->employerScope->canAccess($row, $user)) {
            return $this->sendError(404, 'NOT_FOUND', 'Registration application not found');
        }

        return $this->sendOk($row);
    }

    /**
     * Show by stable mock/frontend code (e.g. rg-ke-1).
     */
    public function showByCode(Request $request, string $code): JsonResponse
    {
        $row = StRegistrationApplication::query()->where('code', $code)->first();

        if (! $row) {
            return $this->sendError(404, 'NOT_FOUND', 'Registration application not found');
        }

        /** @var User|null $user */
        $user = $request->user();
        if ($user && ! $this->employerScope->canAccess($row, $user)) {
            return $this->sendError(404, 'NOT_FOUND', 'Registration application not found');
        }

        return $this->sendOk($row);
    }

    /**
     * Update a registration application.
     */
    public function update(UpdateStRegistrationApplicationRequest $request, int $id): JsonResponse
    {
        $row = StRegistrationApplication::find($id);

        if (! $row) {
            return $this->sendError(404, 'NOT_FOUND', 'Registration application not found');
        }

        /** @var User|null $user */
        $user = $request->user();
        if ($user && ! $this->employerScope->canAccess($row, $user)) {
            return $this->sendError(404, 'NOT_FOUND', 'Registration application not found');
        }

        $row->update($request->validated());

        return $this->sendOk($row->fresh());
    }

    /**
     * Delete a registration application.
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $row = StRegistrationApplication::find($id);

        if (! $row) {
            return $this->sendOk(['success' => true]);
        }

        /** @var User|null $user */
        $user = $request->user();
        if ($user && ! $this->employerScope->canAccess($row, $user)) {
            return $this->sendError(404, 'NOT_FOUND', 'Registration application not found');
        }

        $row->delete();

        return $this->sendOk(['success' => true]);
    }
}
