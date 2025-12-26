<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Ward extends Model
{
    /** @use HasFactory<\Database\Factories\WardFactory> */
    use HasFactory;

    protected $fillable = [
        'ward_number',
        'name',
        'type',
        'total_beds',
        'available_beds',
        'charge_per_day',
        'description',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'total_beds' => 'integer',
            'available_beds' => 'integer',
            'charge_per_day' => 'decimal:2',
            'is_active' => 'boolean',
        ];
    }

    public function beds(): HasMany
    {
        return $this->hasMany(Bed::class);
    }

    public function admissions(): HasMany
    {
        return $this->hasMany(Admission::class);
    }
}
