<?php

namespace App\Http\Requests;

class NotifyStaffWorkflowTaskRequest extends BaseFormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'role' => 'required|string|in:sos,technical,approver',
            'ref_no' => 'nullable|string|max:100',
            'applicant_name' => 'nullable|string|max:255',
            'module_code' => 'nullable|string|max:20',
            'application_id' => 'nullable|integer|min:1',
            'application_code' => 'nullable|string|max:100',
            'step_id' => 'nullable|string|max:100',
            'action_path' => 'nullable|string|max:500',
        ];
    }
}
