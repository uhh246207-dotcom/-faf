<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Template extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'psd_path',
        'preview_path',
        'token_price',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'token_price' => 'integer',
        ];
    }

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function (Template $template) {
            if (empty($template->slug)) {
                $template->slug = Str::slug($template->name);
            }
        });
    }

    public function layers()
    {
        return $this->hasMany(TemplateLayer::class);
    }

    public function renders()
    {
        return $this->hasMany(Render::class);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }
}
