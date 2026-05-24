@extends('layouts.admin')

@section('title', 'Tao Code')

@section('content')
<div class="mb-6">
    <h1 class="text-2xl font-bold text-gray-900">Tao Ma Code</h1>
    <p class="mt-1 text-sm text-gray-600">Tao code don le hoac hang loat</p>
</div>

<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- Single Code Creation -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Tao code don le</h2>

        <form method="POST" action="{{ route('admin.codes.store') }}" class="space-y-4">
            @csrf

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Ma code</label>
                <input type="text" name="code" value="{{ old('code') }}" required
                       placeholder="VD: GIFT2024"
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 uppercase">
                @error('code')
                    <p class="mt-1 text-xs text-red-600">{{ $message }}</p>
                @enderror
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">So token</label>
                <input type="number" name="token_amount" value="{{ old('token_amount', 10) }}" required min="1"
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                @error('token_amount')
                    <p class="mt-1 text-xs text-red-600">{{ $message }}</p>
                @enderror
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Ghi chu (tuy chon)</label>
                <textarea name="note" rows="2" placeholder="VD: Tang khach VIP"
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">{{ old('note') }}</textarea>
                @error('note')
                    <p class="mt-1 text-xs text-red-600">{{ $message }}</p>
                @enderror
            </div>

            <button type="submit"
                    class="w-full py-2.5 px-4 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition">
                Tao code
            </button>
        </form>
    </div>

    <!-- Bulk Code Generation -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Tao code hang loat</h2>

        <form method="POST" action="{{ route('admin.codes.bulk-generate') }}" class="space-y-4">
            @csrf

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">So luong code</label>
                <input type="number" name="count" value="{{ old('count', 10) }}" required min="1" max="100"
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                <p class="mt-1 text-xs text-gray-500">Toi da 100 code moi lan</p>
                @error('count')
                    <p class="mt-1 text-xs text-red-600">{{ $message }}</p>
                @enderror
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">So token moi code</label>
                <input type="number" name="token_amount" value="{{ old('token_amount', 50) }}" required min="1"
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                @error('token_amount')
                    <p class="mt-1 text-xs text-red-600">{{ $message }}</p>
                @enderror
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Ghi chu (tuy chon)</label>
                <textarea name="note" rows="2" placeholder="VD: Batch promo thang 1"
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">{{ old('note') }}</textarea>
                @error('note')
                    <p class="mt-1 text-xs text-red-600">{{ $message }}</p>
                @enderror
            </div>

            <button type="submit"
                    class="w-full py-2.5 px-4 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition">
                Tao hang loat
            </button>
        </form>
    </div>
</div>

<div class="mt-6">
    <a href="{{ route('admin.codes.index') }}" class="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
        &larr; Quay lai danh sach
    </a>
</div>
@endsection
