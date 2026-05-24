@extends('layouts.app')

@section('title', $template->name . ' - Editor')

@push('styles')
<link rel="stylesheet" href="{{ asset('css/editor.css') }}">
@endpush

@section('content')
<div x-data="editorApp()" class="min-h-screen bg-gray-50">
    <!-- Header Bar -->
    <div class="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-20">
        <div class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div class="flex items-center space-x-4">
                <a href="{{ route('templates.index') }}" class="text-gray-500 hover:text-gray-700 transition">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                    </svg>
                </a>
                <h1 class="text-lg font-bold text-gray-900">{{ $template->name }}</h1>
            </div>
            <div class="flex items-center space-x-4">
                <!-- Tier Badge -->
                <span class="hidden sm:inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                    @if ((Auth::user()->tier ?? 'bronze') === 'diamond') bg-purple-100 text-purple-800
                    @elseif ((Auth::user()->tier ?? 'bronze') === 'gold') bg-yellow-100 text-yellow-800
                    @elseif ((Auth::user()->tier ?? 'bronze') === 'silver') bg-gray-200 text-gray-800
                    @else bg-orange-100 text-orange-800
                    @endif">
                    {{ ucfirst(Auth::user()->tier ?? 'bronze') }}
                </span>
                <span class="hidden sm:inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                    Xuat: {{ $template->token_price }} tokens
                </span>
                <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    Token: <span x-text="tokenBalance" class="ml-1"></span>
                </span>
            </div>
        </div>
    </div>

    <!-- Two Column Layout -->
    <div class="max-w-7xl mx-auto px-4 py-6">
        <div class="flex flex-col lg:flex-row gap-6">

            <!-- Left Column - Preview Area (60%) -->
            <div class="w-full lg:w-3/5">
                <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sticky top-20">
                    <h2 class="text-sm font-medium text-gray-500 mb-3">Preview</h2>

                    <!-- Preview Container -->
                    <div class="preview-container relative overflow-hidden rounded-lg" id="previewContainer">
                        <!-- Base preview image -->
                        @if ($template->preview_path)
                            <img src="{{ Storage::url($template->preview_path) }}" alt="Preview"
                                 class="w-full h-auto block" id="basePreview">
                        @else
                            <div class="w-full aspect-[4/3] bg-gray-200 flex items-center justify-center">
                                <span class="text-gray-400">No preview image</span>
                            </div>
                        @endif

                        <!-- Text Overlays -->
                        <template x-for="layer in textLayers" :key="layer.field_key">
                            <div class="absolute pointer-events-none"
                                 :style="getTextOverlayStyle(layer)"
                                 x-text="fields[layer.field_key] || layer.default_value || ''">
                            </div>
                        </template>

                        <!-- Image Overlays -->
                        <template x-for="layer in imageLayers" :key="layer.field_key">
                            <div class="absolute" :style="getImageOverlayStyle(layer)">
                                <img x-show="imagePreviews[layer.field_key]"
                                     :src="imagePreviews[layer.field_key]"
                                     class="w-full h-full object-contain"
                                     alt="">
                            </div>
                        </template>

                        <!-- Watermark Overlay -->
                        <div class="watermark-overlay absolute inset-0 pointer-events-none z-50"></div>

                        <!-- Loading Overlay -->
                        <div x-show="rendering" x-transition
                             class="absolute inset-0 bg-white bg-opacity-80 flex flex-col items-center justify-center z-40">
                            <div class="loading-spinner"></div>
                            <p class="mt-3 text-sm text-gray-600">Dang xu ly...</p>
                        </div>
                    </div>

                    <!-- Render Result -->
                    <div x-show="renderComplete" x-transition class="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center">
                                <svg class="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                                </svg>
                                <span class="text-sm font-medium text-green-800">Xuat anh thanh cong!</span>
                            </div>
                            <a :href="outputUrl" download
                               class="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition">
                                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                                </svg>
                                Tai PNG
                            </a>
                        </div>
                        <img x-show="outputUrl" :src="outputUrl" alt="Render Result" class="mt-3 w-full rounded-lg border border-green-200">
                    </div>

                    <!-- Render Error -->
                    <div x-show="renderFailed" x-transition class="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
                        <div class="flex items-center">
                            <svg class="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            <span class="text-sm font-medium text-red-800" x-text="renderError || 'Co loi xay ra khi render'"></span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right Column - Edit Form (40%) -->
            <div class="w-full lg:w-2/5">
                <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-6">
                    <h2 class="text-lg font-semibold text-gray-900">Chinh sua</h2>

                    <!-- Text Layer Inputs -->
                    <template x-for="layer in textLayers" :key="layer.field_key">
                        <div class="space-y-1">
                            <label class="block text-sm font-medium text-gray-700" x-text="layer.label"></label>
                            <input type="text"
                                   :placeholder="layer.default_value || ('Nhap ' + layer.label.toLowerCase())"
                                   :maxlength="layer.max_length || undefined"
                                   :required="layer.required"
                                   x-model="fields[layer.field_key]"
                                   @input="updateTextField(layer.field_key, $event.target.value)"
                                   class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-sm">
                            <div class="flex justify-between">
                                <span x-show="layer.required && !fields[layer.field_key]" class="text-xs text-red-500">Bat buoc</span>
                                <span x-show="layer.max_length" class="text-xs text-gray-400 ml-auto">
                                    <span x-text="(fields[layer.field_key] || '').length"></span>/<span x-text="layer.max_length"></span>
                                </span>
                            </div>
                        </div>
                    </template>

                    <!-- Image Layer Inputs -->
                    <template x-for="layer in imageLayers" :key="layer.field_key">
                        <div class="space-y-2">
                            <label class="block text-sm font-medium text-gray-700" x-text="layer.label"></label>

                            <!-- Drag & Drop Zone -->
                            <div x-show="!imagePreviews[layer.field_key]"
                                 class="drop-zone border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-indigo-400 transition cursor-pointer"
                                 @click="document.getElementById('file_' + layer.field_key).click()"
                                 @dragover.prevent="$event.currentTarget.classList.add('border-indigo-500', 'bg-indigo-50')"
                                 @dragleave.prevent="$event.currentTarget.classList.remove('border-indigo-500', 'bg-indigo-50')"
                                 @drop.prevent="handleDrop(layer.field_key, $event)">
                                <svg class="mx-auto w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                </svg>
                                <p class="mt-1 text-xs text-gray-500">Keo tha anh vao day hoac bam de chon</p>
                                <p class="mt-1 text-xs text-gray-400">Nen dung anh PNG nen trong suot de dep nhat.</p>
                            </div>

                            <!-- Thumbnail Preview -->
                            <div x-show="imagePreviews[layer.field_key]" class="relative">
                                <img :src="imagePreviews[layer.field_key]" class="w-full h-32 object-contain rounded-lg border border-gray-200 bg-gray-50">
                                <button @click="removeImage(layer.field_key)" type="button"
                                        class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition">
                                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                                    </svg>
                                </button>
                            </div>

                            <!-- Hidden file input -->
                            <input type="file" :accept="layer.accepted_file_types ? '.' + layer.accepted_file_types.split(',').join(',.') : 'image/*'"
                                   class="hidden"
                                   :id="'file_' + layer.field_key"
                                   @change="handleImageUpload(layer.field_key, $event)">
                        </div>
                    </template>

                    <!-- AI Quick Edit Section -->
                    <div x-data="{ aiOpen: false }" class="border-t border-gray-200 pt-4">
                        <button @click="aiOpen = !aiOpen" type="button"
                                class="flex items-center justify-between w-full text-left">
                            <span class="text-sm font-medium text-gray-700">AI chinh nhanh</span>
                            <svg :class="aiOpen ? 'rotate-180' : ''" class="w-4 h-4 text-gray-400 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                            </svg>
                        </button>

                        <div x-show="aiOpen" x-transition class="mt-3 space-y-3">
                            <div class="flex space-x-2">
                                <input type="text" x-model="aiCommand" placeholder="VD: Doi mau chu thanh do"
                                       class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                       @keydown.enter.prevent="submitAiCommand()">
                                <button @click="submitAiCommand()" :disabled="aiLoading || !aiCommand"
                                        class="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition">
                                    <span x-show="!aiLoading">Gui</span>
                                    <span x-show="aiLoading">...</span>
                                </button>
                            </div>

                            <!-- Suggestion Chips -->
                            <div class="flex flex-wrap gap-2">
                                <button type="button" @click="aiCommand = 'Doi mau chu gia thanh do'; submitAiCommand()"
                                        class="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs hover:bg-gray-200 transition">
                                    Doi mau chu gia thanh do
                                </button>
                                <button type="button" @click="aiCommand = 'Tang kich thuoc tieu de'; submitAiCommand()"
                                        class="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs hover:bg-gray-200 transition">
                                    Tang kich thuoc tieu de
                                </button>
                                <button type="button" @click="aiCommand = 'Lam sang anh nhan vat'; submitAiCommand()"
                                        class="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs hover:bg-gray-200 transition">
                                    Lam sang anh nhan vat
                                </button>
                            </div>

                            <!-- AI Actions Results -->
                            <div x-show="aiActions.length > 0" class="space-y-1">
                                <template x-for="(action, idx) in aiActions" :key="idx">
                                    <div class="flex items-center text-xs text-green-700 bg-green-50 px-2 py-1 rounded">
                                        <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                                        </svg>
                                        <span x-text="action.description || (action.action + ': ' + action.field_key)"></span>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="border-t border-gray-200 pt-4 space-y-3">
                        <button @click="submitRender()" :disabled="!canExport"
                                class="w-full py-3 px-4 rounded-lg font-medium text-white transition"
                                :class="canExport ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-300 cursor-not-allowed'">
                            <span x-show="!rendering" x-text="'Xuat anh PNG - mat ' + tokenPrice + ' token'"></span>
                            <span x-show="rendering" class="flex items-center justify-center">
                                <svg class="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                </svg>
                                Dang xu ly...
                            </span>
                        </button>

                        <div x-show="tokenBalance < tokenPrice" class="text-center">
                            <p class="text-sm text-red-600">Khong du token de xuat anh.</p>
                            <a href="{{ route('templates.index') }}" class="text-sm text-indigo-600 hover:text-indigo-800 font-medium">Doi code nap token</a>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</div>
@endsection

@push('scripts')
<script src="{{ asset('js/editor.js') }}"></script>
<script>
    function editorApp() {
        return editorComponent(
            @json($layers),
            @json($template->token_price),
            @json(Auth::user()->token_balance ?? 0),
            @json($template->id)
        );
    }
</script>
@endpush
