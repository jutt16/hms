<?php

namespace App\Http\Requests\Admin\Ipd;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMedicationChartRequest extends FormRequest
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
            'medicine_id' => ['nullable', 'exists:medicines,id'],
            'medicine_name' => ['sometimes', 'required', 'string', 'max:255'],
            'dosage' => ['sometimes', 'required', 'string', 'max:100'],
            'frequency' => ['sometimes', 'required', 'string', 'max:100'],
            'route' => ['sometimes', 'required', 'string', 'max:50'],
            'start_date' => ['sometimes', 'required', 'date'],
            'end_date' => ['nullable', 'date', 'after:start_date'],
            'instructions' => ['nullable', 'string'],
            'status' => ['sometimes', 'in:active,completed,discontinued'],
        ];
    }
}
