@extends('layouts.admin')

@section('title', 'Chi tiet code - ' . $redemptionCode->code)

@section('content')
<div class="mb-6">
    <h1 class="text-2xl font-bold text-gray-900">Chi tiet Code</h1>
    <p class="mt-1 text-sm text-gray-600">Thong tin chi tiet ma code</p>
</div>

<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-2xl">
    <dl class="space-y-4">
        <div class="flex justify-between py-2 border-b border-gray-100">
            <dt class="text-sm font-medium text-gray-500">Code</dt>
            <dd class="text-sm font-mono font-bold text-gray-900">{{ $redemptionCode->code }}</dd>
        </div>
        <div class="flex justify-between py-2 border-b border-gray-100">
            <dt class="text-sm font-medium text-gray-500">So token</dt>
            <dd class="text-sm font-medium text-indigo-600">{{ $redemptionCode->token_amount }} tokens</dd>
        </div>
        <div class="flex justify-between py-2 border-b border-gray-100">
            <dt class="text-sm font-medium text-gray-500">Trang thai</dt>
            <dd>
                @if ($redemptionCode->status === 'active')
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Hoat dong</span>
                @elseif ($redemptionCode->status === 'used')
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Da dung</span>
                @elseif ($redemptionCode->status === 'disabled')
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Vo hieu hoa</span>
                @else
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{{ ucfirst($redemptionCode->status) }}</span>
                @endif
            </dd>
        </div>
        <div class="flex justify-between py-2 border-b border-gray-100">
            <dt class="text-sm font-medium text-gray-500">Nguoi tao</dt>
            <dd class="text-sm text-gray-900">{{ $redemptionCode->createdBy?->name ?? 'N/A' }}</dd>
        </div>
        <div class="flex justify-between py-2 border-b border-gray-100">
            <dt class="text-sm font-medium text-gray-500">Ngay tao</dt>
            <dd class="text-sm text-gray-900">{{ $redemptionCode->created_at->format('d/m/Y H:i:s') }}</dd>
        </div>
        @if ($redemptionCode->usedBy)
        <div class="flex justify-between py-2 border-b border-gray-100">
            <dt class="text-sm font-medium text-gray-500">Nguoi su dung</dt>
            <dd class="text-sm text-gray-900">{{ $redemptionCode->usedBy->name }} ({{ $redemptionCode->usedBy->email }})</dd>
        </div>
        @endif
        @if ($redemptionCode->used_at)
        <div class="flex justify-between py-2 border-b border-gray-100">
            <dt class="text-sm font-medium text-gray-500">Thoi gian su dung</dt>
            <dd class="text-sm text-gray-900">{{ $redemptionCode->used_at->format('d/m/Y H:i:s') }}</dd>
        </div>
        @endif
        @if ($redemptionCode->note)
        <div class="flex justify-between py-2 border-b border-gray-100">
            <dt class="text-sm font-medium text-gray-500">Ghi chu</dt>
            <dd class="text-sm text-gray-900">{{ $redemptionCode->note }}</dd>
        </div>
        @endif
    </dl>

    <div class="mt-6 flex items-center space-x-3">
        @if ($redemptionCode->status === 'active')
        <form method="POST" action="{{ route('admin.codes.disable', $redemptionCode) }}"
              onsubmit="return confirm('Ban chac chan muon vo hieu hoa code nay?')">
            @csrf
            <button type="submit" class="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition">
                Vo hieu hoa
            </button>
        </form>
        @endif
        <a href="{{ route('admin.codes.index') }}" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition">
            Quay lai
        </a>
    </div>
</div>
@endsection
