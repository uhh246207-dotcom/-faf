<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TemplateLayer extends Model
{
    use HasFactory;

    protected $fillable = [
        'template_id',
        'layer_name',
        'field_key',
        'type',
        'label',
        'editable',
        'required',
        'max_length',
        'default_value',
        'accepted_file_types',
        'sort_order',
        'preview_x',
        'preview_y',
        'preview_width',
        'preview_height',
        'font_size',
        'font_color',
        'text_align',
        'z_index',
        'allow_ai_edit',
        'allow_color_edit',
        'allow_position_edit',
        'allow_size_edit',
        'allow_effect_edit',
        'stroke_color',
        'stroke_width',
        'glow_color',
        'brightness',
        'contrast',
        'saturation',
    ];

    protected function casts(): array
    {
        return [
            'editable' => 'boolean',
            'required' => 'boolean',
            'allow_ai_edit' => 'boolean',
            'allow_color_edit' => 'boolean',
            'allow_position_edit' => 'boolean',
            'allow_size_edit' => 'boolean',
            'allow_effect_edit' => 'boolean',
            'max_length' => 'integer',
            'sort_order' => 'integer',
            'preview_x' => 'integer',
            'preview_y' => 'integer',
            'preview_width' => 'integer',
            'preview_height' => 'integer',
            'font_size' => 'integer',
            'z_index' => 'integer',
            'stroke_width' => 'integer',
            'brightness' => 'integer',
            'contrast' => 'integer',
            'saturation' => 'integer',
        ];
    }

    public function template()
    {
        return $this->belongsTo(Template::class);
    }

    public function scopeEditable($query)
    {
        return $query->where('editable', true);
    }

    public function scopeAiEditable($query)
    {
        return $query->where('allow_ai_edit', true)
                     ->where('layer_name', 'NOT LIKE', 'LOCK_%');
    }
}
