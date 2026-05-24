@extends('layouts.admin')

@section('title', 'Sua Layer')

@section('content')
<div class="mb-6">
    <a href="{{ route('admin.layers.index', $template) }}" class="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
        &larr; Quay lai Layers
    </a>
    <h1 class="text-2xl font-bold text-gray-900 mt-2">Sua Layer: {{ $layer->label }}</h1>
</div>

<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-3xl" x-data="{ type: '{{ old('type', $layer->type) }}' }">
    <form method="POST" action="{{ route('admin.layers.update', [$template, $layer]) }}" class="space-y-8">
        @csrf
        @method('PUT')

        <!-- Section 1: Basic Info -->
        <div>
            <h2 class="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">Thong tin co ban</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label for="layer_name" class="block text-sm font-medium text-gray-700 mb-1">Layer Name (trong PSD)</label>
                    <input type="text" name="layer_name" id="layer_name" value="{{ old('layer_name', $layer->layer_name) }}" required
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 @error('layer_name') border-red-500 @enderror">
                    @error('layer_name')
                        <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                    @enderror
                </div>

                <div>
                    <label for="field_key" class="block text-sm font-medium text-gray-700 mb-1">Field Key</label>
                    <input type="text" name="field_key" id="field_key" value="{{ old('field_key', $layer->field_key) }}" required
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 @error('field_key') border-red-500 @enderror">
                    @error('field_key')
                        <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                    @enderror
                </div>

                <div>
                    <label for="type" class="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select name="type" id="type" x-model="type"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                        <option value="text" {{ old('type', $layer->type) === 'text' ? 'selected' : '' }}>Text</option>
                        <option value="image" {{ old('type', $layer->type) === 'image' ? 'selected' : '' }}>Image</option>
                    </select>
                </div>

                <div>
                    <label for="label" class="block text-sm font-medium text-gray-700 mb-1">Label (hien thi cho khach)</label>
                    <input type="text" name="label" id="label" value="{{ old('label', $layer->label) }}" required
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 @error('label') border-red-500 @enderror">
                    @error('label')
                        <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                    @enderror
                </div>

                <div>
                    <label for="sort_order" class="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                    <input type="number" name="sort_order" id="sort_order" value="{{ old('sort_order', $layer->sort_order) }}"
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                </div>

                <div class="flex items-center space-x-6 pt-6">
                    <label class="flex items-center">
                        <input type="hidden" name="editable" value="0">
                        <input type="checkbox" name="editable" value="1" {{ old('editable', $layer->editable) ? 'checked' : '' }}
                               class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded">
                        <span class="ml-2 text-sm text-gray-700">Editable</span>
                    </label>
                    <label class="flex items-center">
                        <input type="hidden" name="required" value="0">
                        <input type="checkbox" name="required" value="1" {{ old('required', $layer->required) ? 'checked' : '' }}
                               class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded">
                        <span class="ml-2 text-sm text-gray-700">Required</span>
                    </label>
                </div>
            </div>
        </div>

        <!-- Section 2: Constraints -->
        <div>
            <h2 class="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">Rang buoc</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div x-show="type === 'text'">
                    <label for="max_length" class="block text-sm font-medium text-gray-700 mb-1">Max Length</label>
                    <input type="number" name="max_length" id="max_length" value="{{ old('max_length', $layer->max_length) }}"
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                </div>

                <div>
                    <label for="default_value" class="block text-sm font-medium text-gray-700 mb-1">Default Value</label>
                    <input type="text" name="default_value" id="default_value" value="{{ old('default_value', $layer->default_value) }}"
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                </div>

                <div x-show="type === 'image'">
                    <label for="accepted_file_types" class="block text-sm font-medium text-gray-700 mb-1">Accepted File Types</label>
                    <input type="text" name="accepted_file_types" id="accepted_file_types" value="{{ old('accepted_file_types', $layer->accepted_file_types) }}"
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                           placeholder="png,jpg,jpeg,webp">
                </div>
            </div>
        </div>

        <!-- Section 3: Preview Position -->
        <div>
            <h2 class="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">Vi tri Preview</h2>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                    <label for="preview_x" class="block text-sm font-medium text-gray-700 mb-1">X (%)</label>
                    <input type="number" name="preview_x" id="preview_x" value="{{ old('preview_x', $layer->preview_x) }}" step="0.1"
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                </div>
                <div>
                    <label for="preview_y" class="block text-sm font-medium text-gray-700 mb-1">Y (%)</label>
                    <input type="number" name="preview_y" id="preview_y" value="{{ old('preview_y', $layer->preview_y) }}" step="0.1"
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                </div>
                <div>
                    <label for="preview_width" class="block text-sm font-medium text-gray-700 mb-1">Width (%)</label>
                    <input type="number" name="preview_width" id="preview_width" value="{{ old('preview_width', $layer->preview_width) }}" step="0.1"
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                </div>
                <div>
                    <label for="preview_height" class="block text-sm font-medium text-gray-700 mb-1">Height (%)</label>
                    <input type="number" name="preview_height" id="preview_height" value="{{ old('preview_height', $layer->preview_height) }}" step="0.1"
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                </div>
                <div>
                    <label for="z_index" class="block text-sm font-medium text-gray-700 mb-1">Z-Index</label>
                    <input type="number" name="z_index" id="z_index" value="{{ old('z_index', $layer->z_index) }}"
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                </div>
            </div>
        </div>

        <!-- Section 4: Text Styling -->
        <div x-show="type === 'text'">
            <h2 class="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">Kieu chu (Text)</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label for="font_size" class="block text-sm font-medium text-gray-700 mb-1">Font Size (px)</label>
                    <input type="number" name="font_size" id="font_size" value="{{ old('font_size', $layer->font_size) }}"
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                </div>
                <div>
                    <label for="font_color" class="block text-sm font-medium text-gray-700 mb-1">Font Color</label>
                    <input type="color" name="font_color" id="font_color" value="{{ old('font_color', $layer->font_color ?? '#000000') }}"
                           class="w-full h-10 px-1 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                </div>
                <div>
                    <label for="text_align" class="block text-sm font-medium text-gray-700 mb-1">Text Align</label>
                    <select name="text_align" id="text_align"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                        <option value="left" {{ old('text_align', $layer->text_align) === 'left' ? 'selected' : '' }}>Left</option>
                        <option value="center" {{ old('text_align', $layer->text_align) === 'center' ? 'selected' : '' }}>Center</option>
                        <option value="right" {{ old('text_align', $layer->text_align) === 'right' ? 'selected' : '' }}>Right</option>
                    </select>
                </div>
            </div>
        </div>

        <!-- Section 5: AI Edit Permissions -->
        <div>
            <h2 class="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">AI Edit Permissions</h2>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                <label class="flex items-center">
                    <input type="hidden" name="allow_ai_edit" value="0">
                    <input type="checkbox" name="allow_ai_edit" value="1" {{ old('allow_ai_edit', $layer->allow_ai_edit) ? 'checked' : '' }}
                           class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded">
                    <span class="ml-2 text-sm text-gray-700">Allow AI Edit</span>
                </label>
                <label class="flex items-center">
                    <input type="hidden" name="allow_color_edit" value="0">
                    <input type="checkbox" name="allow_color_edit" value="1" {{ old('allow_color_edit', $layer->allow_color_edit) ? 'checked' : '' }}
                           class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded">
                    <span class="ml-2 text-sm text-gray-700">Allow Color Edit</span>
                </label>
                <label class="flex items-center">
                    <input type="hidden" name="allow_position_edit" value="0">
                    <input type="checkbox" name="allow_position_edit" value="1" {{ old('allow_position_edit', $layer->allow_position_edit) ? 'checked' : '' }}
                           class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded">
                    <span class="ml-2 text-sm text-gray-700">Allow Position Edit</span>
                </label>
                <label class="flex items-center">
                    <input type="hidden" name="allow_size_edit" value="0">
                    <input type="checkbox" name="allow_size_edit" value="1" {{ old('allow_size_edit', $layer->allow_size_edit) ? 'checked' : '' }}
                           class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded">
                    <span class="ml-2 text-sm text-gray-700">Allow Size Edit</span>
                </label>
                <label class="flex items-center">
                    <input type="hidden" name="allow_effect_edit" value="0">
                    <input type="checkbox" name="allow_effect_edit" value="1" {{ old('allow_effect_edit', $layer->allow_effect_edit) ? 'checked' : '' }}
                           class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded">
                    <span class="ml-2 text-sm text-gray-700">Allow Effect Edit</span>
                </label>
            </div>
        </div>

        <!-- Section 6: Effects -->
        <div>
            <h2 class="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">Effects</h2>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                    <label for="stroke_color" class="block text-sm font-medium text-gray-700 mb-1">Stroke Color</label>
                    <input type="color" name="stroke_color" id="stroke_color" value="{{ old('stroke_color', $layer->stroke_color ?? '#000000') }}"
                           class="w-full h-10 px-1 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                </div>
                <div>
                    <label for="stroke_width" class="block text-sm font-medium text-gray-700 mb-1">Stroke Width</label>
                    <input type="number" name="stroke_width" id="stroke_width" value="{{ old('stroke_width', $layer->stroke_width) }}" step="0.1"
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                </div>
                <div>
                    <label for="glow_color" class="block text-sm font-medium text-gray-700 mb-1">Glow Color</label>
                    <input type="color" name="glow_color" id="glow_color" value="{{ old('glow_color', $layer->glow_color ?? '#ffffff') }}"
                           class="w-full h-10 px-1 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                </div>
                <div>
                    <label for="brightness" class="block text-sm font-medium text-gray-700 mb-1">Brightness</label>
                    <input type="number" name="brightness" id="brightness" value="{{ old('brightness', $layer->brightness) }}" step="1"
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                </div>
                <div>
                    <label for="contrast" class="block text-sm font-medium text-gray-700 mb-1">Contrast</label>
                    <input type="number" name="contrast" id="contrast" value="{{ old('contrast', $layer->contrast) }}" step="1"
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                </div>
                <div>
                    <label for="saturation" class="block text-sm font-medium text-gray-700 mb-1">Saturation</label>
                    <input type="number" name="saturation" id="saturation" value="{{ old('saturation', $layer->saturation) }}" step="1"
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                </div>
            </div>
        </div>

        <div class="pt-4">
            <button type="submit"
                    class="inline-flex items-center px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition">
                Cap Nhat Layer
            </button>
        </div>
    </form>
</div>
@endsection
