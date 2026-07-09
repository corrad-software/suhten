<?php

namespace App\Http\Requests;

class StoreStRegistrationApplicationRequest extends BaseFormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'code' => 'nullable|string|max:64|unique:st_registration_applications,code',
            'module_code' => 'required|string|in:RG-KE,RG-CE,RG-KG,RG-CG',
            'ref_no' => 'nullable|string|max:64|unique:st_registration_applications,ref_no',
            'app_type' => 'required|string|max:64',
            'applicant_name' => 'required|string|min:1|max:255',
            'identity_no' => 'required|string|min:1|max:128',
            'category_or_class' => 'required|string|max:64',
            'status' => 'nullable|string|max:64',
            'submitted_at' => 'nullable|date',
            'stage_entered_at' => 'nullable|date',
            'sla_target_hours' => 'nullable|integer|min:1',
            'employer_name' => 'nullable|string|max:255',
            'cdp_points' => 'nullable|integer|min:0',
            'assigned_officer' => 'nullable|string|max:255',
            'fee_amount' => 'nullable|numeric|min:0',
            'note' => 'nullable|string',
            'detail' => 'nullable|array',
        ];
    }
}
