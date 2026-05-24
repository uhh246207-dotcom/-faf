@extends('layouts.admin')

@section('title', 'Tao Template')

@section('content')
<div class="mb-6">
    <a href="{{ route('admin.templates.index') }}" class="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
        &larr; Quay lai danh sach
    </a>
    <h1 class="text-2xl font-bold text-gray-900 mt-2">Tao Template Moi</h1>
</div>

<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-2xl">
    <form method="POST" action="{{ route('admin.templates.store') }}" enctype="multipart/form-data" class="space-y-6">
        @csrf

        <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Ten template</label>
            <input type="text" name="name" id="name" value="{{ old('name') }}" required
                   class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 @error('name') border-red-500 @enderror"
                   placeholder="VD: Banner Sale Tet 2024">
            @error('name')
                <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
            @enderror
        </div>

        <div>
            <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Mo ta</label>
            <textarea name="description" id="description" rows="3"
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 @error('description') border-red-500 @enderror"
                      placeholder="Mo ta ngan ve template">{{ old('description') }}</textarea>
            @error('description')
                <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
            @enderror
        </div>

        <div>
            <label for="token_price" class="block text-sm font-medium text-gray-700 mb-1">Token Price</label>
            <input type="number" name="token_price" id="token_price" value="{{ old('token_price', 1) }}" min="0" required
                   class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 @error('token_price') border-red-500 @enderror">
            @error('token_price')
                <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
            @enderror
        </div>

        <div>
            <label for="psd_file" class="block text-sm font-medium text-gray-700 mb-1">File PSD</label>
            <input type="file" name="psd_file" id="psd_file" accept=".psd"
                   class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:text-indigo-700 file:font-medium hover:file:bg-indigo-100 @error('psd_file') border-red-500 @enderror">
            @error('psd_file')
                <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
            @enderror
        </div>

        <div>
            <label for="preview_file" class="block text-sm font-medium text-gray-700 mb-1">Anh preview</label>
            <input type="file" name="preview_file" id="preview_file" accept="image/*"
                   class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:text-indigo-700 file:font-medium hover:file:bg-indigo-100 @error('preview_file') border-red-500 @enderror">
            @error('preview_file')
                <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
            @enderror
        </div>

        <div>
            <label for="status" class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select name="status" id="status"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                <option value="active" {{ old('status') === 'active' ? 'selected' : '' }}>Active</option>
                <option value="inactive" {{ old('status') === 'inactive' ? 'selected' : '' }}>Inactive</option>
            </select>
        </div>

        <div class="pt-4">
            <button type="submit"
                    class="inline-flex items-center px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition">
                Tao Template
            </button>
        </div>
    </form>
</div>
@endsection
