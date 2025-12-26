<?php

namespace App\Http\Requests\Admin\Ipd;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBedRequest extends FormRequest
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
            'ward_id' => ['sometimes', 'required', 'exists:wards,id'],
            'bed_number' => ['sometimes', 'required', 'string', 'max:50'],
            'status' => ['sometimes', 'required', 'in:available,occupied,maintenance,reserved'],
            'notes' => ['nullable', 'string'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}
