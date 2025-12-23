<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LabResult extends Model
{
    /** @use HasFactory<\Database\Factories\LabResultFactory> */
    use HasFactory;

    protected $fillable = [
        'result_number',
        'patient_id',
        'doctor_id',
        'lab_test_id',
        'appointment_id',
        'result_value',
        'reference_range',
        'status',
        'notes',
        'test_date',
        'result_date',
        'performed_by',
    ];

    protected function casts(): array
    {
        return [
            'test_date' => 'date',
            'result_date' => 'date',
        ];
    }

    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class);
    }

    public function doctor(): BelongsTo
    {
        return $this->belongsTo(Doctor::class);
    }

    public function labTest(): BelongsTo
    {
        return $this->belongsTo(LabTest::class);
    }

    public function appointment(): BelongsTo
    {
        return $this->belongsTo(Appointment::class);
    }

    public function performer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'performed_by');
    }
}
