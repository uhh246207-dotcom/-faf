<?php

namespace App\Services;

use App\Models\Render;
use App\Models\User;

class TierService
{
    const TIER_BRONZE = 'bronze';
    const TIER_SILVER = 'silver';
    const TIER_GOLD = 'gold';
    const TIER_DIAMOND = 'diamond';

    const TIER_THRESHOLDS = [
        self::TIER_BRONZE => 0,
        self::TIER_SILVER => 6,
        self::TIER_GOLD => 21,
        self::TIER_DIAMOND => 51,
    ];

    /**
     * Calculate the tier based on completed render count.
     */
    public function calculateTier(User $user): string
    {
        $completedRenders = $user->renders()
            ->where('status', Render::STATUS_COMPLETED)
            ->count();

        if ($completedRenders >= self::TIER_THRESHOLDS[self::TIER_DIAMOND]) {
            return self::TIER_DIAMOND;
        }

        if ($completedRenders >= self::TIER_THRESHOLDS[self::TIER_GOLD]) {
            return self::TIER_GOLD;
        }

        if ($completedRenders >= self::TIER_THRESHOLDS[self::TIER_SILVER]) {
            return self::TIER_SILVER;
        }

        return self::TIER_BRONZE;
    }

    /**
     * Recalculate and save the user's tier.
     */
    public function updateUserTier(User $user): void
    {
        $tier = $this->calculateTier($user);
        $user->update(['tier' => $tier]);
    }
}
