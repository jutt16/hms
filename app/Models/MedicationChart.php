<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MedicationChart extends Model
{
    /** @use HasFactory<\Database\Factories\MedicationChartFactory> */
    use HasFactory;

    protected $fillable = [
        'admission_id',
        'patient_id',
        'medicine_id',
        'medicine_name',
        'dosage',
        'frequency',
        'route',
        'start_date',
        'end_date',
        'instructions',
        'status',
        'prescribed_by',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
        ];
    }

    public function admission(): BelongsTo
    {
        return $this->belongsTo(Admission::class);
    }

    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class);
    }

    public function medicine(): BelongsTo
    {
        return $this->belongsTo(Medicine::class);
    }

    public function prescribedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'prescribed_by');
    }
}
