@extends('layouts.admin')

@section('title', 'Layers - ' . $template->name)

@section('content')
<div class="mb-6">
    <a href="{{ route('admin.templates.index') }}" class="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
        &larr; Quay lai Templates
    </a>
    <h1 class="text-2xl font-bold text-gray-900 mt-2">Layers: {{ $template->name }}</h1>
</div>

<div class="flex justify-end mb-4">
    <a href="{{ route('admin.layers.create', $template) }}"
       class="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        Them Layer Moi
    </a>
</div>

<div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
    <div class="overflow-x-auto">
        <table class="w-full text-sm text-left">
            <thead class="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                    <th class="px-4 py-3">Sort</th>
                    <th class="px-4 py-3">Layer Name</th>
                    <th class="px-4 py-3">Field Key</th>
                    <th class="px-4 py-3">Type</th>
                    <th class="px-4 py-3">Label</th>
                    <th class="px-4 py-3">Editable</th>
                    <th class="px-4 py-3">Required</th>
                    <th class="px-4 py-3">AI Edit</th>
                    <th class="px-4 py-3">Actions</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
                @forelse ($layers as $layer)
                <tr class="hover:bg-gray-50">
                    <td class="px-4 py-3 text-gray-500">{{ $layer->sort_order }}</td>
                    <td class="px-4 py-3 font-mono text-xs text-gray-700">{{ $layer->layer_name }}</td>
                    <td class="px-4 py-3 font-mono text-xs text-indigo-600">{{ $layer->field_key }}</td>
                    <td class="px-4 py-3">
                        <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium {{ $layer->type === 'text' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800' }}">
                            {{ $layer->type }}
                        </span>
                    </td>
                    <td class="px-4 py-3 text-gray-900">{{ $layer->label }}</td>
                    <td class="px-4 py-3">
                        @if ($layer->editable)
                            <span class="text-green-600">Yes</span>
                        @else
                            <span class="text-gray-400">No</span>
                        @endif
                    </td>
                    <td class="px-4 py-3">
                        @if ($layer->required)
                            <span class="text-red-600">Yes</span>
                        @else
                            <span class="text-gray-400">No</span>
                        @endif
                    </td>
                    <td class="px-4 py-3">
                        @if ($layer->allow_ai_edit)
                            <span class="text-green-600">Yes</span>
                        @else
                            <span class="text-gray-400">No</span>
                        @endif
                    </td>
                    <td class="px-4 py-3">
                        <div class="flex items-center space-x-2">
                            <a href="{{ route('admin.layers.edit', [$template, $layer]) }}"
                               class="text-indigo-600 hover:text-indigo-800 text-xs font-medium">Edit</a>
                            <form method="POST" action="{{ route('admin.layers.destroy', [$template, $layer]) }}"
                                  onsubmit="return confirm('Xoa layer nay?')" class="inline">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="text-red-600 hover:text-red-800 text-xs font-medium">Delete</button>
                            </form>
                        </div>
                    </td>
                </tr>
                @empty
                <tr>
                    <td colspan="9" class="px-4 py-8 text-center text-gray-500">Chua co layer nao.</td>
                </tr>
                @endforelse
            </tbody>
        </table>
    </div>
</div>
@endsection
