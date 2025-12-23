<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LabTest extends Model
{
    /** @use HasFactory<\Database\Factories\LabTestFactory> */
    use HasFactory;

    protected $fillable = [
        'test_code',
        'name',
        'description',
        'price',
        'category',
        'normal_range',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'is_active' => 'boolean',
        ];
    }

    public function labResults(): HasMany
    {
        return $this->hasMany(LabResult::class);
    }
}
