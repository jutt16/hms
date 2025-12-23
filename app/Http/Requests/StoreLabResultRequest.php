<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreLabResultRequest extends FormRequest
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
            'patient_id' => ['required', 'exists:patients,id'],
            'doctor_id' => ['nullable', 'exists:doctors,id'],
            'lab_test_id' => ['required', 'exists:lab_tests,id'],
            'appointment_id' => ['nullable', 'exists:appointments,id'],
            'result_value' => ['nullable', 'string'],
            'reference_range' => ['nullable', 'string'],
            'status' => ['required', 'in:pending,completed,abnormal'],
            'notes' => ['nullable', 'string'],
            'test_date' => ['required', 'date'],
            'result_date' => ['nullable', 'date', 'after_or_equal:test_date'],
        ];
    }
}
