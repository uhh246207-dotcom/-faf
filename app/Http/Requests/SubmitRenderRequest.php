<?php

namespace App\Http\Requests;

use App\Models\Template;
use Illuminate\Foundation\Http\FormRequest;

class SubmitRenderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $template = $this->route('template');

        if (!$template instanceof Template) {
            return [];
        }

        $rules = [];
        $layers = $template->layers()->editable()->get();

        foreach ($layers as $layer) {
            $fieldRules = [];

            if ($layer->required) {
                $fieldRules[] = 'required';
            } else {
                $fieldRules[] = 'nullable';
            }

            if ($layer->type === 'text') {
                $fieldRules[] = 'string';
                if ($layer->max_length) {
                    $fieldRules[] = "max:{$layer->max_length}";
                }
            } elseif ($layer->type === 'image') {
                $fieldRules[] = 'file';
                $fieldRules[] = 'max:10240';
            }

            $rules[$layer->field_key] = $fieldRules;
        }

        return $rules;
    }
}
