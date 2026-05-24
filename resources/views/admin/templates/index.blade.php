@extends('layouts.admin')

@section('title', 'Templates')

@section('content')
<div class="flex items-center justify-between mb-6">
    <h1 class="text-2xl font-bold text-gray-900">Templates</h1>
    <a href="{{ route('admin.templates.create') }}"
       class="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        Tao Template Moi
    </a>
</div>

<div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
    <div class="overflow-x-auto">
        <table class="w-full text-sm text-left">
            <thead class="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                    <th class="px-4 py-3">ID</th>
                    <th class="px-4 py-3">Preview</th>
                    <th class="px-4 py-3">Ten</th>
                    <th class="px-4 py-3">Token Price</th>
                    <th class="px-4 py-3">Status</th>
                    <th class="px-4 py-3">Actions</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
                @forelse ($templates as $template)
                <tr class="hover:bg-gray-50">
                    <td class="px-4 py-3 text-gray-500">{{ $template->id }}</td>
                    <td class="px-4 py-3">
                        @if ($template->preview_path)
                            <img src="{{ Storage::url($template->preview_path) }}" alt="{{ $template->name }}" class="w-12 h-12 rounded object-cover">
                        @else
                            <div class="w-12 h-12 rounded bg-gray-200 flex items-center justify-center">
                                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                </svg>
                            </div>
                        @endif
                    </td>
                    <td class="px-4 py-3 font-medium text-gray-900">{{ $template->name }}</td>
                    <td class="px-4 py-3">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            {{ $template->token_price }} tokens
                        </span>
                    </td>
                    <td class="px-4 py-3">
                        @if ($template->status === 'active')
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>
                        @else
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Inactive</span>
                        @endif
                    </td>
                    <td class="px-4 py-3">
                        <div class="flex items-center space-x-2">
                            <a href="{{ route('admin.templates.edit', $template) }}"
                               class="text-indigo-600 hover:text-indigo-800 text-xs font-medium">Edit</a>
                            <a href="{{ route('admin.layers.index', $template) }}"
                               class="text-green-600 hover:text-green-800 text-xs font-medium">Layers</a>
                            <form method="POST" action="{{ route('admin.templates.destroy', $template) }}"
                                  onsubmit="return confirm('Ban co chac muon xoa template nay?')" class="inline">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="text-red-600 hover:text-red-800 text-xs font-medium">Delete</button>
                            </form>
                        </div>
                    </td>
                </tr>
                @empty
                <tr>
                    <td colspan="6" class="px-4 py-8 text-center text-gray-500">Chua co template nao.</td>
                </tr>
                @endforelse
            </tbody>
        </table>
    </div>

    @if ($templates->hasPages())
    <div class="px-4 py-3 border-t border-gray-200">
        {{ $templates->links() }}
    </div>
    @endif
</div>
@endsection
