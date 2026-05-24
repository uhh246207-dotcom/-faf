<?php

namespace App\Services;

use App\Models\RedemptionCode;
use App\Models\TokenTransaction;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class RedemptionCodeService
{
    protected TokenService $tokenService;

    public function __construct()
    {
        $this->tokenService = new TokenService();
    }

    /**
     * Redeem a code for a user.
     *
     * @throws \RuntimeException
     */
    public function redeem(User $user, string $code): TokenTransaction
    {
        return DB::transaction(function () use ($user, $code) {
            $redemptionCode = RedemptionCode::where('code', $code)->lockForUpdate()->first();

            if (!$redemptionCode) {
                throw new \RuntimeException('Code khong ton tai.');
            }

            if ($redemptionCode->status === RedemptionCode::STATUS_USED) {
                throw new \RuntimeException('Code da duoc su dung.');
            }

            if ($redemptionCode->status === RedemptionCode::STATUS_DISABLED) {
                throw new \RuntimeException('Code da bi vo hieu hoa.');
            }

            if ($redemptionCode->status === RedemptionCode::STATUS_EXPIRED) {
                throw new \RuntimeException('Code da het han.');
            }

            if (!$redemptionCode->isRedeemable()) {
                throw new \RuntimeException('Code khong hop le.');
            }

            // Mark code as used
            $redemptionCode->update([
                'status' => RedemptionCode::STATUS_USED,
                'used_by' => $user->id,
                'used_at' => now(),
            ]);

            // Credit tokens to user
            $transaction = $this->tokenService->credit(
                $user,
                $redemptionCode->token_amount,
                "Doi code: {$code} (+{$redemptionCode->token_amount} tokens)"
            );

            return $transaction;
        });
    }

    /**
     * Bulk generate redemption codes.
     */
    public function generateCodes(int $count, int $tokenAmount, int $adminId, ?string $note = null): array
    {
        $codes = [];

        for ($i = 0; $i < $count; $i++) {
            $code = $this->generateUniqueCode();

            $codes[] = RedemptionCode::create([
                'code' => $code,
                'token_amount' => $tokenAmount,
                'status' => RedemptionCode::STATUS_ACTIVE,
                'created_by' => $adminId,
                'note' => $note,
            ]);
        }

        return $codes;
    }

    /**
     * Disable a code (only if not already used).
     *
     * @throws \RuntimeException
     */
    public function disableCode(RedemptionCode $code): RedemptionCode
    {
        if ($code->status === RedemptionCode::STATUS_USED) {
            throw new \RuntimeException('Khong the vo hieu hoa code da duoc su dung.');
        }

        $code->update(['status' => RedemptionCode::STATUS_DISABLED]);

        return $code;
    }

    /**
     * Generate a unique 8-character uppercase alphanumeric code.
     */
    protected function generateUniqueCode(): string
    {
        do {
            $code = strtoupper(Str::random(8));
            // Ensure only alphanumeric
            $code = preg_replace('/[^A-Z0-9]/', '', $code . strtoupper(Str::random(4)));
            $code = substr($code, 0, 8);
        } while (RedemptionCode::where('code', $code)->exists());

        return $code;
    }
}
