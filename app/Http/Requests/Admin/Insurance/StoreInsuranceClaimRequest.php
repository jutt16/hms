<?php

namespace App\Http\Requests\Admin\Insurance;

use Illuminate\Foundation\Http\FormRequest;

class StoreInsuranceClaimRequest extends FormRequest
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
            'bill_id' => ['required', 'exists:bills,id'],
            'insurance_provider_id' => ['required', 'exists:insurance_providers,id'],
            'policy_number' => ['required', 'string', 'max:255'],
        ];
    }
}
