<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Render extends Model
{
    use HasFactory;

    const STATUS_PENDING = 'pending';
    const STATUS_PROCESSING = 'processing';
    const STATUS_COMPLETED = 'completed';
    const STATUS_FAILED = 'failed';

    protected $fillable = [
        'user_id',
        'template_id',
        'status',
        'input_data',
        'output_path',
        'error_message',
        'token_cost',
    ];

    protected function casts(): array
    {
        return [
            'input_data' => 'array',
            'token_cost' => 'integer',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function template()
    {
        return $this->belongsTo(Template::class);
    }

    public function transaction()
    {
        return $this->hasOne(TokenTransaction::class);
    }
}
