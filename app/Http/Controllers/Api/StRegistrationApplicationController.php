<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreStRegistrationApplicationRequest;
use App\Http\Requests\UpdateStRegistrationApplicationRequest;
use App\Http\Traits\ApiResponse;
use App\Models\StRegistrationApplication;
use App\Services\RegistrationWorkflowStarter;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class StRegistrationApplicationController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected RegistrationWorkflowStarter $workflowStarter,
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
            $prefix = 'ST/'.$data['module_code'].'/'.now()->format('Y').'/';
            $seq = StRegistrationApplication::query()
                ->where('module_code', $data['module_code'])
                ->count() + 1;
            $data['ref_no'] = $prefix.str_pad((string) $seq, 5, '0', STR_PAD_LEFT);
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
     * Show a single registration application.
     */
    public function show(int $id): JsonResponse
    {
        $row = StRegistrationApplication::find($id);

        if (! $row) {
            return $this->sendError(404, 'NOT_FOUND', 'Registration application not found');
        }

        return $this->sendOk($row);
    }

    /**
     * Show by stable mock/frontend code (e.g. rg-ke-1).
     */
    public function showByCode(string $code): JsonResponse
    {
        $row = StRegistrationApplication::query()->where('code', $code)->first();

        if (! $row) {
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

        $row->update($request->validated());

        return $this->sendOk($row->fresh());
    }

    /**
     * Delete a registration application.
     */
    public function destroy(int $id): JsonResponse
    {
        StRegistrationApplication::where('id', $id)->delete();

        return $this->sendOk(['success' => true]);
    }
}
