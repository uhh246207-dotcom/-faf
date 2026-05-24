@extends('layouts.admin')

@section('title', 'Ma Code')

@section('content')
<div class="mb-6 flex items-center justify-between">
    <div>
        <h1 class="text-2xl font-bold text-gray-900">Quan ly Ma Code</h1>
        <p class="mt-1 text-sm text-gray-600">Tao va quan ly code nap token</p>
    </div>
    <a href="{{ route('admin.codes.create') }}"
       class="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        Tao Code
    </a>
</div>

<!-- Stats Cards -->
<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <p class="text-xs font-medium text-gray-500 uppercase">Tong code</p>
        <p class="text-2xl font-bold text-gray-900">{{ $stats['total'] }}</p>
    </div>
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <p class="text-xs font-medium text-gray-500 uppercase">Dang hoat dong</p>
        <p class="text-2xl font-bold text-green-600">{{ $stats['active'] }}</p>
    </div>
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <p class="text-xs font-medium text-gray-500 uppercase">Da su dung</p>
        <p class="text-2xl font-bold text-blue-600">{{ $stats['used'] }}</p>
    </div>
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <p class="text-xs font-medium text-gray-500 uppercase">Vo hieu hoa</p>
        <p class="text-2xl font-bold text-red-600">{{ $stats['disabled'] }}</p>
    </div>
</div>

<!-- Filters -->
<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
    <form method="GET" action="{{ route('admin.codes.index') }}" class="flex flex-col sm:flex-row gap-3">
        <input type="text" name="search" value="{{ request('search') }}" placeholder="Tim code hoac user..."
               class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
        <select name="status" class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
            <option value="">Tat ca trang thai</option>
            <option value="active" {{ request('status') === 'active' ? 'selected' : '' }}>Hoat dong</option>
            <option value="used" {{ request('status') === 'used' ? 'selected' : '' }}>Da su dung</option>
            <option value="disabled" {{ request('status') === 'disabled' ? 'selected' : '' }}>Vo hieu hoa</option>
            <option value="expired" {{ request('status') === 'expired' ? 'selected' : '' }}>Het han</option>
        </select>
        <button type="submit" class="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-900 transition">
            Loc
        </button>
        <a href="{{ route('admin.codes.index') }}" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition text-center">
            Reset
        </a>
    </form>
</div>

<!-- Quick link to history -->
<div class="mb-4">
    <a href="{{ route('admin.code-history') }}" class="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800 font-medium">
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        Xem lich su doi code (chi tiet)
    </a>
</div>

<!-- Codes Table -->
<div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
    <div class="overflow-x-auto">
        <table class="w-full text-sm text-left">
            <thead class="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                    <th class="px-4 py-3">Code</th>
                    <th class="px-4 py-3">Token</th>
                    <th class="px-4 py-3">Trang thai</th>
                    <th class="px-4 py-3">Nguoi dung</th>
                    <th class="px-4 py-3">Thoi gian dung</th>
                    <th class="px-4 py-3">Nguoi tao</th>
                    <th class="px-4 py-3">Ghi chu</th>
                    <th class="px-4 py-3">Hanh dong</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
                @forelse ($codes as $code)
                <tr class="hover:bg-gray-50">
                    <td class="px-4 py-3 font-mono font-medium text-gray-900">{{ $code->code }}</td>
                    <td class="px-4 py-3">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            {{ $code->token_amount }} tokens
                        </span>
                    </td>
                    <td class="px-4 py-3">
                        @if ($code->status === 'active')
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Hoat dong</span>
                        @elseif ($code->status === 'used')
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Da dung</span>
                        @elseif ($code->status === 'disabled')
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Vo hieu hoa</span>
                        @else
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{{ ucfirst($code->status) }}</span>
                        @endif
                    </td>
                    <td class="px-4 py-3 text-gray-600">
                        {{ $code->usedBy?->name ?? '-' }}
                    </td>
                    <td class="px-4 py-3 text-gray-500 text-xs">
                        {{ $code->used_at ? $code->used_at->format('d/m/Y H:i') : '-' }}
                    </td>
                    <td class="px-4 py-3 text-gray-600">
                        {{ $code->createdBy?->name ?? '-' }}
                    </td>
                    <td class="px-4 py-3 text-gray-500 text-xs max-w-[150px] truncate">
                        {{ $code->note ?? '-' }}
                    </td>
                    <td class="px-4 py-3">
                        @if ($code->status === 'active')
                        <form method="POST" action="{{ route('admin.codes.disable', $code) }}" class="inline"
                              onsubmit="return confirm('Ban chac chan muon vo hieu hoa code nay?')">
                            @csrf
                            <button type="submit" class="text-xs text-red-600 hover:text-red-800 font-medium">
                                Vo hieu hoa
                            </button>
                        </form>
                        @else
                            <span class="text-xs text-gray-400">-</span>
                        @endif
                    </td>
                </tr>
                @empty
                <tr>
                    <td colspan="8" class="px-4 py-8 text-center text-gray-500">Chua co code nao.</td>
                </tr>
                @endforelse
            </tbody>
        </table>
    </div>

    @if ($codes->hasPages())
    <div class="px-4 py-3 border-t border-gray-200">
        {{ $codes->links() }}
    </div>
    @endif
</div>
@endsection
