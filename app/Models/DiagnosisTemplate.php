<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DiagnosisTemplate extends Model
{
    /** @use HasFactory<\Database\Factories\DiagnosisTemplateFactory> */
    use HasFactory;

    protected $fillable = [
        'doctor_id',
        'name',
        'category',
        'diagnosis',
        'symptoms',
        'recommendations',
        'is_public',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_public' => 'boolean',
            'is_active' => 'boolean',
        ];
    }

    public function doctor(): BelongsTo
    {
        return $this->belongsTo(Doctor::class);
    }
}
