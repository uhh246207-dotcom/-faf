@extends('layouts.admin')

@section('title', 'Lich su doi code')

@section('content')
<div class="mb-6">
    <h1 class="text-2xl font-bold text-gray-900">Lich su doi code</h1>
    <p class="mt-1 text-sm text-gray-600">Xem chi tiet ai da dung code nao, khi nao, bao nhieu token</p>
</div>

<!-- Filters -->
<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
    <form method="GET" action="{{ route('admin.code-history') }}" class="flex flex-col sm:flex-row gap-3">
        <input type="text" name="search" value="{{ request('search') }}" placeholder="Tim code hoac ten user..."
               class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
        <input type="date" name="date_from" value="{{ request('date_from') }}"
               class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
        <input type="date" name="date_to" value="{{ request('date_to') }}"
               class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
        <button type="submit" class="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-900 transition">
            Loc
        </button>
        <a href="{{ route('admin.code-history') }}" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition text-center">
            Reset
        </a>
    </form>
</div>

<!-- History Table -->
<div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
    <div class="overflow-x-auto">
        <table class="w-full text-sm text-left">
            <thead class="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                    <th class="px-4 py-3">Code</th>
                    <th class="px-4 py-3">Token</th>
                    <th class="px-4 py-3">Nguoi dung</th>
                    <th class="px-4 py-3">Email</th>
                    <th class="px-4 py-3">Thoi gian doi</th>
                    <th class="px-4 py-3">Nguoi tao code</th>
                    <th class="px-4 py-3">Ghi chu</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
                @forelse ($codes as $code)
                <tr class="hover:bg-gray-50">
                    <td class="px-4 py-3 font-mono font-medium text-gray-900">{{ $code->code }}</td>
                    <td class="px-4 py-3">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            +{{ $code->token_amount }} tokens
                        </span>
                    </td>
                    <td class="px-4 py-3 font-medium text-gray-900">
                        {{ $code->usedBy?->name ?? 'N/A' }}
                    </td>
                    <td class="px-4 py-3 text-gray-600">
                        {{ $code->usedBy?->email ?? '-' }}
                    </td>
                    <td class="px-4 py-3 text-gray-500 text-xs">
                        {{ $code->used_at ? $code->used_at->format('d/m/Y H:i:s') : '-' }}
                    </td>
                    <td class="px-4 py-3 text-gray-600">
                        {{ $code->createdBy?->name ?? '-' }}
                    </td>
                    <td class="px-4 py-3 text-gray-500 text-xs max-w-[200px] truncate">
                        {{ $code->note ?? '-' }}
                    </td>
                </tr>
                @empty
                <tr>
                    <td colspan="7" class="px-4 py-8 text-center text-gray-500">Chua co code nao duoc doi.</td>
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

<div class="mt-6">
    <a href="{{ route('admin.codes.index') }}" class="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
        &larr; Quay lai quan ly code
    </a>
</div>
@endsection
