<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PatientReport extends Model
{
    /** @use HasFactory<\Database\Factories\PatientReportFactory> */
    use HasFactory;

    protected $fillable = [
        'patient_id',
        'report_type',
        'title',
        'description',
        'file_path',
        'report_date',
        'uploaded_by',
    ];

    protected function casts(): array
    {
        return [
            'report_date' => 'date',
        ];
    }

    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class);
    }

    public function uploadedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
}
