<?php

namespace App\Http\Requests\Admin\Ipd;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAdmissionRequest extends FormRequest
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
            'bed_id' => ['sometimes', 'required', 'exists:beds,id'],
            'admission_reason' => ['sometimes', 'required', 'string'],
            'diagnosis' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
