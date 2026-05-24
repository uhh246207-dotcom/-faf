<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTemplateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'token_price' => ['required', 'integer', 'min:1'],
            'psd_file' => ['nullable', 'file', 'max:102400'],
            'preview_file' => ['nullable', 'file', 'image', 'max:10240'],
            'status' => ['required', 'in:active,inactive'],
        ];
    }
}
