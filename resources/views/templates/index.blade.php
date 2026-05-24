@extends('layouts.app')

@section('title', 'Templates')

@section('content')
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
        <div>
            <h1 class="text-3xl font-bold text-gray-900">Chon Template</h1>
            <p class="mt-1 text-gray-600">Chon template de bat dau chinh sua</p>
        </div>
        <div class="flex items-center space-x-4">
            <!-- Tier Badge -->
            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                @if ((Auth::user()->tier ?? 'bronze') === 'diamond') bg-purple-100 text-purple-800
                @elseif ((Auth::user()->tier ?? 'bronze') === 'gold') bg-yellow-100 text-yellow-800
                @elseif ((Auth::user()->tier ?? 'bronze') === 'silver') bg-gray-200 text-gray-800
                @else bg-orange-100 text-orange-800
                @endif">
                {{ ucfirst(Auth::user()->tier ?? 'bronze') }}
            </span>
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-2">
                <span class="text-sm text-gray-500">Token cua ban:</span>
                <span class="ml-1 text-lg font-bold text-indigo-600">{{ Auth::user()->token_balance ?? 0 }}</span>
            </div>
            <form method="POST" action="{{ route('logout') }}">
                @csrf
                <button type="submit" class="text-sm text-gray-500 hover:text-gray-700">Dang xuat</button>
            </form>
        </div>
    </div>

    <!-- Redeem Code Section -->
    @include('components.redeem-code')

    <!-- Template Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        @forelse ($templates as $template)
        <a href="{{ route('templates.show', $template->slug) }}" class="group block">
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-1">
                <!-- Preview Image -->
                <div class="aspect-[4/3] bg-gray-100 overflow-hidden">
                    @if ($template->preview_path)
                        <img src="{{ Storage::url($template->preview_path) }}" alt="{{ $template->name }}"
                             class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200">
                    @else
                        <div class="w-full h-full flex items-center justify-center">
                            <svg class="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                            </svg>
                        </div>
                    @endif
                </div>

                <!-- Card Body -->
                <div class="p-4">
                    <h3 class="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                        {{ $template->name }}
                    </h3>
                    @if ($template->description)
                        <p class="mt-1 text-sm text-gray-600 line-clamp-2">{{ Str::limit($template->description, 80) }}</p>
                    @endif
                    <div class="mt-3 flex items-center justify-between">
                        <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                            {{ $template->token_price }} tokens
                        </span>
                        <span class="text-sm text-indigo-600 font-medium group-hover:text-indigo-800">
                            Chinh sua &rarr;
                        </span>
                    </div>
                </div>
            </div>
        </a>
        @empty
        <div class="col-span-full text-center py-16">
            <svg class="mx-auto w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            <p class="mt-4 text-gray-500">Chua co template nao.</p>
        </div>
        @endforelse
    </div>
</div>
@endsection
