<?php

namespace App\Http\Requests;

class CompleteWorkflowTaskRequest extends BaseFormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'outcome' => 'required|string|max:100',
            'note' => 'nullable|string|max:2000',
        ];
    }
}
