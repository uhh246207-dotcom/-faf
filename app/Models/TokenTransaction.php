<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TokenTransaction extends Model
{
    use HasFactory;

    const TYPE_DEDUCT = 'deduct';
    const TYPE_REFUND = 'refund';
    const TYPE_CREDIT = 'credit';
    const TYPE_REDEEM = 'redeem';

    protected $fillable = [
        'user_id',
        'amount',
        'type',
        'description',
        'render_id',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'integer',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function render()
    {
        return $this->belongsTo(Render::class);
    }
}
