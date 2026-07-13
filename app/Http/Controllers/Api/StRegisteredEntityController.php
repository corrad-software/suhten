<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreStRegisteredEntityRequest;
use App\Http\Requests\UpdateStRegisteredEntityRequest;
use App\Http\Traits\ApiResponse;
use App\Models\StRegisteredEntity;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class StRegisteredEntityController extends Controller
{
    use ApiResponse;

    /**
     * List registered entities with pagination, search, and filters.
     */
    public function index(Request $request): JsonResponse
    {
        $page = (int) $request->input('page', 1);
        $limit = (int) $request->input('limit', 50);
        $q = $request->input('q');
        $moduleCode = $request->input('module_code');
        $compliance = $request->input('compliance');
        $sortBy = $request->input('sort_by', 'expires_at');
        $sortDir = $request->input('sort_dir', 'asc');

        $allowedSort = [
            'expires_at', 'registered_at', 'created_at', 'certificate_no',
            'holder_name', 'compliance', 'module_code', 'id',
        ];
        if (! in_array($sortBy, $allowedSort, true)) {
            $sortBy = 'expires_at';
        }
        $sortDir = strtolower((string) $sortDir) === 'desc' ? 'desc' : 'asc';

        $query = StRegisteredEntity::query();

        if ($moduleCode) {
            $query->where('module_code', $moduleCode);
        }

        if ($compliance) {
            $query->where('compliance', $compliance);
        }

        if ($q) {
            $query->where(function ($builder) use ($q) {
                $builder->where('certificate_no', 'like', "%{$q}%")
                    ->orWhere('holder_name', 'like', "%{$q}%")
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
     * Create a registered entity.
     */
    public function store(StoreStRegisteredEntityRequest $request): JsonResponse
    {
        $data = $request->validated();

        if (empty($data['code'])) {
            $data['code'] = 'ent-'.Str::lower(str_replace('-', '', $data['module_code'])).'-'.Str::lower(Str::random(8));
        }

        $data['compliance'] = $data['compliance'] ?? 'active';
        $data['cdp_points'] = $data['cdp_points'] ?? 0;

        $row = StRegisteredEntity::create($data);

        return $this->sendCreated($row);
    }

    /**
     * Show a single registered entity.
     */
    public function show(int $id): JsonResponse
    {
        $row = StRegisteredEntity::find($id);

        if (! $row) {
            return $this->sendError(404, 'NOT_FOUND', 'Registered entity not found');
        }

        return $this->sendOk($row);
    }

    /**
     * Update a registered entity.
     */
    public function update(UpdateStRegisteredEntityRequest $request, int $id): JsonResponse
    {
        $row = StRegisteredEntity::find($id);

        if (! $row) {
            return $this->sendError(404, 'NOT_FOUND', 'Registered entity not found');
        }

        $row->update($request->validated());

        return $this->sendOk($row->fresh());
    }

    /**
     * Delete a registered entity.
     */
    public function destroy(int $id): JsonResponse
    {
        StRegisteredEntity::where('id', $id)->delete();

        return $this->sendOk(['success' => true]);
    }
}
