@extends('layouts.app')

@section('title', 'PSD Editor - Home')

@section('content')
<div class="flex items-center justify-center min-h-screen">
    <div class="text-center">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">PSD Template Editor</h1>
        <p class="text-lg text-gray-600 mb-8">Create stunning designs from PSD templates with ease.</p>
        <a href="/templates" class="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
            Browse Templates
        </a>
    </div>
</div>
@endsection
