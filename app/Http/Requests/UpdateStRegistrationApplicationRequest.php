<?php

namespace App\Http\Requests;

class UpdateStRegistrationApplicationRequest extends BaseFormRequest
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
        $id = $this->route('id') ?? $this->route('st_registration_application');

        return [
            'code' => 'sometimes|string|max:64|unique:st_registration_applications,code,'.$id,
            'module_code' => 'sometimes|string|in:RG-KE,RG-CE,RG-KG,RG-CG',
            'ref_no' => 'sometimes|string|max:64|unique:st_registration_applications,ref_no,'.$id,
            'app_type' => 'sometimes|string|max:64',
            'applicant_name' => 'sometimes|string|min:1|max:255',
            'identity_no' => 'sometimes|string|min:1|max:128',
            'category_or_class' => 'sometimes|string|max:64',
            'status' => 'sometimes|string|max:64',
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
