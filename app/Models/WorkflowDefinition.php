<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WorkflowDefinition extends Model
{
    /**
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'slug',
        'version',
        'description',
        'definition',
        'is_active',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'definition' => 'array',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Engine-ready definition array (name/version merged with stored steps).
     *
     * @return array<string, mixed>
     */
    public function toEngineArray(): array
    {
        $definition = $this->definition ?? [];

        return array_merge($definition, [
            'name' => $this->name,
            'version' => $this->version,
        ]);
    }
}
