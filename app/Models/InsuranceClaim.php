<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InsuranceClaim extends Model
{
    /** @use HasFactory<\Database\Factories\InsuranceClaimFactory> */
    use HasFactory;

    protected $fillable = [
        'claim_number',
        'patient_id',
        'bill_id',
        'insurance_provider_id',
        'policy_number',
        'bill_amount',
        'claim_amount',
        'approved_amount',
        'rejected_amount',
        'status',
        'submitted_date',
        'approved_date',
        'rejected_date',
        'rejection_reason',
        'notes',
        'processed_by',
    ];

    protected function casts(): array
    {
        return [
            'bill_amount' => 'decimal:2',
            'claim_amount' => 'decimal:2',
            'approved_amount' => 'decimal:2',
            'rejected_amount' => 'decimal:2',
            'submitted_date' => 'date',
            'approved_date' => 'date',
            'rejected_date' => 'date',
        ];
    }

    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class);
    }

    public function bill(): BelongsTo
    {
        return $this->belongsTo(Bill::class);
    }

    public function insuranceProvider(): BelongsTo
    {
        return $this->belongsTo(InsuranceProvider::class);
    }

    public function processedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'processed_by');
    }
}
