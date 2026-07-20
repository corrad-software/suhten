<?php

namespace App\Models;

use App\Http\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StRegistrationApplication extends Model
{
    use Auditable, HasFactory;

    protected $table = 'st_registration_applications';

    /**
     * @var list<string>
     */
    protected $fillable = [
        'code',
        'module_code',
        'ref_no',
        'app_type',
        'applicant_name',
        'identity_no',
        'category_or_class',
        'status',
        'submitted_at',
        'stage_entered_at',
        'sla_target_hours',
        'employer_name',
        'cdp_points',
        'assigned_officer',
        'fee_amount',
        'note',
        'detail',
        'workflow_instance_id',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'submitted_at' => 'datetime',
            'stage_entered_at' => 'datetime',
            'sla_target_hours' => 'integer',
            'cdp_points' => 'integer',
            'fee_amount' => 'decimal:2',
            'detail' => 'array',
        ];
    }
}
