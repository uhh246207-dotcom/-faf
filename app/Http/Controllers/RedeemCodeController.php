<?php

namespace App\Http\Controllers;

use App\Services\RedemptionCodeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RedeemCodeController extends Controller
{
    protected RedemptionCodeService $service;

    public function __construct()
    {
        $this->service = new RedemptionCodeService();
    }

    /**
     * Redeem a code via AJAX.
     */
    public function redeem(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'code' => ['required', 'string', 'max:20'],
        ]);

        try {
            $transaction = $this->service->redeem(
                Auth::user(),
                strtoupper(trim($validated['code']))
            );

            return response()->json([
                'success' => true,
                'message' => "Doi code thanh cong! Ban nhan duoc {$transaction->amount} tokens.",
                'new_balance' => Auth::user()->fresh()->token_balance,
            ]);
        } catch (\RuntimeException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }
}
