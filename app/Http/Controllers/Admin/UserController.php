<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\TokenService;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index()
    {
        $users = User::orderBy('name')->paginate(20);

        return view('admin.users.index', compact('users'));
    }

    public function addTokens(Request $request, User $user)
    {
        $validated = $request->validate([
            'amount' => ['required', 'integer', 'min:1'],
            'description' => ['nullable', 'string', 'max:255'],
        ]);

        $tokenService = new TokenService();
        $tokenService->credit(
            $user,
            $validated['amount'],
            $validated['description'] ?? 'Admin credit'
        );

        return redirect('/admin/users')->with('success', "Added {$validated['amount']} tokens to {$user->name}.");
    }
}
