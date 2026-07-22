<?php

namespace App\Http\Requests;

class NotifyApplicantQueryRequest extends BaseFormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'applicant_email' => 'required|email|max:255',
            'note' => 'required|string|min:1|max:5000',
            'ref_no' => 'nullable|string|max:100',
            'applicant_name' => 'nullable|string|max:255',
            'module_code' => 'nullable|string|max:20',
            'application_id' => 'nullable|integer|min:1',
            'application_code' => 'nullable|string|max:100',
            'action_path' => 'nullable|string|max:500',
        ];
    }
}
