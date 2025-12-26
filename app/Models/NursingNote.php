<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NursingNote extends Model
{
    /** @use HasFactory<\Database\Factories\NursingNoteFactory> */
    use HasFactory;

    protected $fillable = [
        'admission_id',
        'patient_id',
        'note',
        'note_type',
        'created_by',
        'note_date',
    ];

    protected function casts(): array
    {
        return [
            'note_date' => 'datetime',
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

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
