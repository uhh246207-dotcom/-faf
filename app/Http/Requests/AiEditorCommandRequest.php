<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AiEditorCommandRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'template_id' => ['required', 'exists:templates,id'],
            'command' => ['required', 'string', 'max:500'],
        ];
    }
}
