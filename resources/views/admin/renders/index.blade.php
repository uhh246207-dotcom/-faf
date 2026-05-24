@extends('layouts.admin')

@section('title', 'Render History')

@section('content')
<div class="mb-6">
    <h1 class="text-2xl font-bold text-gray-900">Render History</h1>
</div>

<div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
    <div class="overflow-x-auto">
        <table class="w-full text-sm text-left">
            <thead class="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                    <th class="px-4 py-3">ID</th>
                    <th class="px-4 py-3">User</th>
                    <th class="px-4 py-3">Template</th>
                    <th class="px-4 py-3">Status</th>
                    <th class="px-4 py-3">Token Cost</th>
                    <th class="px-4 py-3">Created At</th>
                    <th class="px-4 py-3">Output</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
                @forelse ($renders as $render)
                <tr class="hover:bg-gray-50">
                    <td class="px-4 py-3 text-gray-500">{{ $render->id }}</td>
                    <td class="px-4 py-3 text-gray-900">{{ $render->user->name ?? 'N/A' }}</td>
                    <td class="px-4 py-3 text-gray-900">{{ $render->template->name ?? 'N/A' }}</td>
                    <td class="px-4 py-3">
                        @switch($render->status)
                            @case('pending')
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>
                                @break
                            @case('processing')
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Processing</span>
                                @break
                            @case('completed')
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Completed</span>
                                @break
                            @case('failed')
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Failed</span>
                                @break
                            @default
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{{ $render->status }}</span>
                        @endswitch
                    </td>
                    <td class="px-4 py-3 text-gray-600">{{ $render->token_cost }} tokens</td>
                    <td class="px-4 py-3 text-gray-500 text-xs">{{ $render->created_at->format('d/m/Y H:i') }}</td>
                    <td class="px-4 py-3">
                        @if ($render->output_path)
                            <a href="{{ Storage::url($render->output_path) }}" target="_blank" class="text-indigo-600 hover:text-indigo-800 text-xs font-medium">View</a>
                        @else
                            <span class="text-gray-400 text-xs">-</span>
                        @endif
                    </td>
                </tr>
                @empty
                <tr>
                    <td colspan="7" class="px-4 py-8 text-center text-gray-500">Chua co render nao.</td>
                </tr>
                @endforelse
            </tbody>
        </table>
    </div>

    @if ($renders->hasPages())
    <div class="px-4 py-3 border-t border-gray-200">
        {{ $renders->links() }}
    </div>
    @endif
</div>
@endsection
