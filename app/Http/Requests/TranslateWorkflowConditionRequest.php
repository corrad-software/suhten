<?php

namespace App\Http\Requests;

class TranslateWorkflowConditionRequest extends BaseFormRequest
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
            'natural_language' => 'required|string|min:3|max:1000',
        ];
    }
}
