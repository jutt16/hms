<?php

namespace App\Http\Requests\Admin\Ipd;

use Illuminate\Foundation\Http\FormRequest;

class UpdateNursingNoteRequest extends FormRequest
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
            'note' => ['sometimes', 'required', 'string'],
            'note_type' => ['sometimes', 'required', 'in:general,medication,vital,incident,instruction'],
            'note_date' => ['sometimes', 'required', 'date'],
        ];
    }
}
