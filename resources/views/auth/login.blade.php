@extends('layouts.app')

@section('title', 'Login')

@section('content')
<div class="min-h-screen flex items-center justify-center px-4">
    <div class="w-full max-w-md">
        <div class="bg-white rounded-xl shadow-md p-8">
            <div class="text-center mb-8">
                <h1 class="text-2xl font-bold text-gray-900">Dang nhap</h1>
                <p class="mt-2 text-sm text-gray-600">Chao mung ban quay lai</p>
            </div>

            <form method="POST" action="{{ url('/login') }}" class="space-y-5">
                @csrf

                <div>
                    <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" name="email" id="email" value="{{ old('email') }}" required autofocus
                           class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition @error('email') border-red-500 @enderror"
                           placeholder="email@example.com">
                    @error('email')
                        <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                    @enderror
                </div>

                <div>
                    <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Mat khau</label>
                    <input type="password" name="password" id="password" required
                           class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition @error('password') border-red-500 @enderror"
                           placeholder="••••••••">
                    @error('password')
                        <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                    @enderror
                </div>

                <div class="flex items-center">
                    <input type="checkbox" name="remember" id="remember"
                           class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded">
                    <label for="remember" class="ml-2 text-sm text-gray-600">Ghi nho dang nhap</label>
                </div>

                <button type="submit"
                        class="w-full bg-indigo-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition">
                    Dang nhap
                </button>
            </form>

            <p class="mt-6 text-center text-sm text-gray-600">
                Chua co tai khoan?
                <a href="{{ url('/register') }}" class="text-indigo-600 hover:text-indigo-500 font-medium">Dang ky ngay</a>
            </p>
        </div>
    </div>
</div>
@endsection
