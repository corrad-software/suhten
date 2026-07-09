<?php

namespace App\Http\Requests;

class StoreStRegisteredEntityRequest extends BaseFormRequest
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
            'code' => 'nullable|string|max:64|unique:st_registered_entities,code',
            'module_code' => 'required|string|in:RG-KE,RG-CE,RG-KG,RG-CG',
            'certificate_no' => 'required|string|max:128|unique:st_registered_entities,certificate_no',
            'holder_name' => 'required|string|min:1|max:255',
            'identity_no' => 'required|string|min:1|max:128',
            'category_or_class' => 'required|string|max:64',
            'employer_name' => 'nullable|string|max:255',
            'registered_at' => 'required|date',
            'expires_at' => 'required|date',
            'compliance' => 'nullable|string|in:active,expiring_soon,expired,suspended',
            'cdp_points' => 'nullable|integer|min:0',
            'status_label' => 'nullable|string|max:128',
        ];
    }
}
