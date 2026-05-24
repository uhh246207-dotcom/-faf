@extends('layouts.admin')

@section('title', 'Users')

@section('content')
<div class="mb-6">
    <h1 class="text-2xl font-bold text-gray-900">Quan ly Users</h1>
</div>

<div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
    <div class="overflow-x-auto">
        <table class="w-full text-sm text-left">
            <thead class="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                    <th class="px-4 py-3">ID</th>
                    <th class="px-4 py-3">Name</th>
                    <th class="px-4 py-3">Email</th>
                    <th class="px-4 py-3">Role</th>
                    <th class="px-4 py-3">Token Balance</th>
                    <th class="px-4 py-3">Actions</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
                @forelse ($users as $user)
                <tr class="hover:bg-gray-50">
                    <td class="px-4 py-3 text-gray-500">{{ $user->id }}</td>
                    <td class="px-4 py-3 font-medium text-gray-900">{{ $user->name }}</td>
                    <td class="px-4 py-3 text-gray-600">{{ $user->email }}</td>
                    <td class="px-4 py-3">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {{ $user->role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800' }}">
                            {{ ucfirst($user->role) }}
                        </span>
                    </td>
                    <td class="px-4 py-3">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {{ $user->token_balance }} tokens
                        </span>
                    </td>
                    <td class="px-4 py-3">
                        <form method="POST" action="{{ route('admin.users.add-tokens', $user) }}" class="flex items-center space-x-2">
                            @csrf
                            <input type="number" name="amount" min="1" value="10" required
                                   class="w-20 px-2 py-1 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                            <button type="submit"
                                    class="inline-flex items-center px-3 py-1 bg-green-600 text-white rounded text-xs font-medium hover:bg-green-700 transition">
                                + Tokens
                            </button>
                        </form>
                    </td>
                </tr>
                @empty
                <tr>
                    <td colspan="6" class="px-4 py-8 text-center text-gray-500">Chua co user nao.</td>
                </tr>
                @endforelse
            </tbody>
        </table>
    </div>

    @if ($users->hasPages())
    <div class="px-4 py-3 border-t border-gray-200">
        {{ $users->links() }}
    </div>
    @endif
</div>
@endsection
