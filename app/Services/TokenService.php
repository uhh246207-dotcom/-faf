<?php

namespace App\Services;

use App\Models\Render;
use App\Models\TokenTransaction;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class TokenService
{
    public function deduct(User $user, int $amount, Render $render): TokenTransaction
    {
        return DB::transaction(function () use ($user, $amount, $render) {
            $user->decrement('token_balance', $amount);

            return TokenTransaction::create([
                'user_id' => $user->id,
                'amount' => -$amount,
                'type' => TokenTransaction::TYPE_DEDUCT,
                'description' => "Render #{$render->id} for template",
                'render_id' => $render->id,
            ]);
        });
    }

    public function refund(User $user, int $amount, Render $render): TokenTransaction
    {
        return DB::transaction(function () use ($user, $amount, $render) {
            $user->increment('token_balance', $amount);

            return TokenTransaction::create([
                'user_id' => $user->id,
                'amount' => $amount,
                'type' => TokenTransaction::TYPE_REFUND,
                'description' => "Refund for failed render #{$render->id}",
                'render_id' => $render->id,
            ]);
        });
    }

    public function credit(User $user, int $amount, string $description): TokenTransaction
    {
        return DB::transaction(function () use ($user, $amount, $description) {
            $user->increment('token_balance', $amount);

            return TokenTransaction::create([
                'user_id' => $user->id,
                'amount' => $amount,
                'type' => TokenTransaction::TYPE_CREDIT,
                'description' => $description,
                'render_id' => null,
            ]);
        });
    }
}
