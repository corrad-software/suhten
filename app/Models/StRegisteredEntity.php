<?php

namespace App\Models;

use App\Http\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StRegisteredEntity extends Model
{
    use Auditable, HasFactory;

    protected $table = 'st_registered_entities';

    /**
     * @var list<string>
     */
    protected $fillable = [
        'code',
        'module_code',
        'certificate_no',
        'holder_name',
        'identity_no',
        'category_or_class',
        'employer_name',
        'registered_at',
        'expires_at',
        'compliance',
        'cdp_points',
        'status_label',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'registered_at' => 'datetime',
            'expires_at' => 'datetime',
            'cdp_points' => 'integer',
        ];
    }
}
