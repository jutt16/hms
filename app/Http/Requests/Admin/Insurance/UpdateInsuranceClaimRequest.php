<?php

namespace App\Http\Requests\Admin\Insurance;

use Illuminate\Foundation\Http\FormRequest;

class UpdateInsuranceClaimRequest extends FormRequest
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
            'policy_number' => ['sometimes', 'required', 'string', 'max:255'],
            'insurance_provider_id' => ['sometimes', 'required', 'exists:insurance_providers,id'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
