<?php

namespace App\Http\Requests\Admin\Ipd;

use Illuminate\Foundation\Http\FormRequest;

class StoreNursingNoteRequest extends FormRequest
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
            'admission_id' => ['required', 'exists:admissions,id'],
            'patient_id' => ['required', 'exists:patients,id'],
            'note' => ['required', 'string'],
            'note_type' => ['required', 'in:general,medication,vital,incident,instruction'],
            'note_date' => ['required', 'date'],
        ];
    }
}
