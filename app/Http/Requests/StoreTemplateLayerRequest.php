<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTemplateLayerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'layer_name' => ['required', 'string', 'max:255'],
            'field_key' => ['required', 'string', 'max:100'],
            'type' => ['required', 'in:text,image'],
            'label' => ['required', 'string', 'max:255'],
            'editable' => ['required', 'boolean'],
            'required' => ['required', 'boolean'],
            'max_length' => ['nullable', 'integer', 'min:1'],
            'default_value' => ['nullable', 'string', 'max:255'],
            'accepted_file_types' => ['nullable', 'string', 'max:255'],
            'sort_order' => ['required', 'integer', 'min:0'],
            'preview_x' => ['nullable', 'integer'],
            'preview_y' => ['nullable', 'integer'],
            'preview_width' => ['nullable', 'integer', 'min:1'],
            'preview_height' => ['nullable', 'integer', 'min:1'],
            'font_size' => ['nullable', 'integer', 'min:1'],
            'font_color' => ['nullable', 'string', 'max:20'],
            'text_align' => ['nullable', 'in:left,center,right'],
            'z_index' => ['nullable', 'integer'],
            'allow_ai_edit' => ['nullable', 'boolean'],
            'allow_color_edit' => ['nullable', 'boolean'],
            'allow_position_edit' => ['nullable', 'boolean'],
            'allow_size_edit' => ['nullable', 'boolean'],
            'allow_effect_edit' => ['nullable', 'boolean'],
            'stroke_color' => ['nullable', 'string', 'max:20'],
            'stroke_width' => ['nullable', 'integer', 'min:0'],
            'glow_color' => ['nullable', 'string', 'max:20'],
            'brightness' => ['nullable', 'integer', 'min:-100', 'max:100'],
            'contrast' => ['nullable', 'integer', 'min:-100', 'max:100'],
            'saturation' => ['nullable', 'integer', 'min:-100', 'max:100'],
        ];
    }
}
