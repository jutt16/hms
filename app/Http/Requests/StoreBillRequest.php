<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBillRequest extends FormRequest
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
            'patient_id' => ['nullable', 'exists:patients,id'],
            'bill_type' => ['required', 'in:consultation,pharmacy,lab,service,combined'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.item_type' => ['required', 'in:medicine,lab_test,service,consultation'],
            'items.*.medicine_id' => ['required_if:items.*.item_type,medicine', 'nullable', 'exists:medicines,id'],
            'items.*.lab_test_id' => ['required_if:items.*.item_type,lab_test', 'nullable', 'exists:lab_tests,id'],
            'items.*.item_name' => ['required', 'string', 'max:255'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'items.*.unit_price' => ['required', 'numeric', 'min:0'],
            'items.*.description' => ['nullable', 'string'],
            'tax' => ['nullable', 'numeric', 'min:0'],
            'discount' => ['nullable', 'numeric', 'min:0'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
