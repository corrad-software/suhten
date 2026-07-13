<?php

namespace App\Http\Requests;

class UpdateStRegisteredEntityRequest extends BaseFormRequest
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
        $id = $this->route('id') ?? $this->route('st_registered_entity');

        return [
            'code' => 'sometimes|string|max:64|unique:st_registered_entities,code,'.$id,
            'module_code' => 'sometimes|string|in:RG-KE,RG-CE,RG-KG,RG-CG',
            'certificate_no' => 'sometimes|string|max:128|unique:st_registered_entities,certificate_no,'.$id,
            'holder_name' => 'sometimes|string|min:1|max:255',
            'identity_no' => 'sometimes|string|min:1|max:128',
            'category_or_class' => 'sometimes|string|max:64',
            'employer_name' => 'nullable|string|max:255',
            'registered_at' => 'sometimes|date',
            'expires_at' => 'sometimes|date',
            'compliance' => 'nullable|string|in:active,expiring_soon,expired,suspended',
            'cdp_points' => 'nullable|integer|min:0',
            'status_label' => 'nullable|string|max:128',
        ];
    }
}
