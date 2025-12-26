<?php

namespace App\Http\Requests\Admin\Ipd;

use Illuminate\Foundation\Http\FormRequest;

class UpdateVitalSignRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'temperature' => ['nullable', 'numeric', 'min:30', 'max:45'],
            'blood_pressure_systolic' => ['nullable', 'integer', 'min:50', 'max:250'],
            'blood_pressure_diastolic' => ['nullable', 'integer', 'min:30', 'max:150'],
            'pulse_rate' => ['nullable', 'integer', 'min:30', 'max:200'],
            'respiratory_rate' => ['nullable', 'integer', 'min:10', 'max:50'],
            'oxygen_saturation' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'weight' => ['nullable', 'numeric', 'min:0'],
            'height' => ['nullable', 'numeric', 'min:0'],
            'notes' => ['nullable', 'string'],
            'recorded_at' => ['sometimes', 'required', 'date'],
        ];
    }
}
