<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RedemptionCode extends Model
{
    use HasFactory;

    const STATUS_ACTIVE = 'active';
    const STATUS_USED = 'used';
    const STATUS_EXPIRED = 'expired';
    const STATUS_DISABLED = 'disabled';

    protected $fillable = [
        'code',
        'token_amount',
        'status',
        'used_by',
        'used_at',
        'created_by',
        'note',
    ];

    protected function casts(): array
    {
        return [
            'token_amount' => 'integer',
            'used_at' => 'datetime',
        ];
    }

    /**
     * Get the user who used this code.
     */
    public function usedBy()
    {
        return $this->belongsTo(User::class, 'used_by');
    }

    /**
     * Get the admin who created this code.
     */
    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Scope: only active codes.
     */
    public function scopeActive($query)
    {
        return $query->where('status', self::STATUS_ACTIVE);
    }

    /**
     * Scope: only used codes.
     */
    public function scopeUsed($query)
    {
        return $query->where('status', self::STATUS_USED);
    }

    /**
     * Scope: only disabled codes.
     */
    public function scopeDisabled($query)
    {
        return $query->where('status', self::STATUS_DISABLED);
    }

    /**
     * Check if code is available for redemption.
     */
    public function isRedeemable(): bool
    {
        return $this->status === self::STATUS_ACTIVE;
    }
}
