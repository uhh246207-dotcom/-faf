<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\RedemptionCodeController;
use App\Http\Controllers\Admin\RenderHistoryController;
use App\Http\Controllers\Admin\TemplateController;
use App\Http\Controllers\Admin\TemplateLayerController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\AiEditorCommandController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\RedeemCodeController;
use App\Http\Controllers\RenderController;
use App\Http\Controllers\TemplateEditorController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

Route::get('/login', [LoginController::class, 'showLoginForm'])->name('login');
Route::post('/login', [LoginController::class, 'login']);
Route::post('/logout', [LoginController::class, 'logout'])->name('logout');

Route::get('/register', [RegisterController::class, 'showRegistrationForm'])->name('register');
Route::post('/register', [RegisterController::class, 'register']);

Route::get('/', function () {
    return redirect('/templates');
});

/*
|--------------------------------------------------------------------------
| Customer Routes (Auth Required)
|--------------------------------------------------------------------------
*/

Route::middleware(['auth'])->group(function () {
    Route::get('/templates', [TemplateEditorController::class, 'index'])->name('templates.index');
    Route::get('/templates/{slug}', [TemplateEditorController::class, 'show'])->name('templates.show');

    Route::post('/templates/{template}/render', [RenderController::class, 'store'])->name('renders.store');
    Route::get('/renders/{render}/status', [RenderController::class, 'status'])->name('renders.status');
    Route::get('/renders/{render}/download', [RenderController::class, 'download'])->name('renders.download');

    Route::post('/ai/editor-command', [AiEditorCommandController::class, 'process'])
        ->middleware('throttle:10,1')
        ->name('ai.editor-command');

    Route::post('/redeem-code', [RedeemCodeController::class, 'redeem'])->name('redeem-code');
});

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'admin'])->prefix('admin')->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('admin.dashboard');

    Route::get('/templates', [TemplateController::class, 'index'])->name('admin.templates.index');
    Route::get('/templates/create', [TemplateController::class, 'create'])->name('admin.templates.create');
    Route::post('/templates', [TemplateController::class, 'store'])->name('admin.templates.store');
    Route::get('/templates/{template}/edit', [TemplateController::class, 'edit'])->name('admin.templates.edit');
    Route::put('/templates/{template}', [TemplateController::class, 'update'])->name('admin.templates.update');
    Route::delete('/templates/{template}', [TemplateController::class, 'destroy'])->name('admin.templates.destroy');

    Route::get('/templates/{template}/layers', [TemplateLayerController::class, 'index'])->name('admin.layers.index');
    Route::get('/templates/{template}/layers/create', [TemplateLayerController::class, 'create'])->name('admin.layers.create');
    Route::post('/templates/{template}/layers', [TemplateLayerController::class, 'store'])->name('admin.layers.store');
    Route::get('/templates/{template}/layers/{layer}/edit', [TemplateLayerController::class, 'edit'])->name('admin.layers.edit');
    Route::put('/templates/{template}/layers/{layer}', [TemplateLayerController::class, 'update'])->name('admin.layers.update');
    Route::delete('/templates/{template}/layers/{layer}', [TemplateLayerController::class, 'destroy'])->name('admin.layers.destroy');

    Route::get('/users', [UserController::class, 'index'])->name('admin.users.index');
    Route::post('/users/{user}/add-tokens', [UserController::class, 'addTokens'])->name('admin.users.add-tokens');

    Route::get('/renders', [RenderHistoryController::class, 'index'])->name('admin.renders.index');

    Route::get('/codes', [RedemptionCodeController::class, 'index'])->name('admin.codes.index');
    Route::get('/codes/create', [RedemptionCodeController::class, 'create'])->name('admin.codes.create');
    Route::post('/codes', [RedemptionCodeController::class, 'store'])->name('admin.codes.store');
    Route::post('/codes/bulk-generate', [RedemptionCodeController::class, 'bulkGenerate'])->name('admin.codes.bulk-generate');
    Route::get('/codes/{code}', [RedemptionCodeController::class, 'show'])->name('admin.codes.show');
    Route::post('/codes/{code}/disable', [RedemptionCodeController::class, 'disable'])->name('admin.codes.disable');
    Route::get('/code-history', [RedemptionCodeController::class, 'history'])->name('admin.code-history');
});
