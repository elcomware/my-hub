<?php

use App\Http\Controllers\Platform\TenantController;
use App\Http\Middleware\EnsurePlatformAdmin;
use Illuminate\Support\Facades\Route;

Route::prefix('platform')
    ->middleware(['auth', 'verified', EnsurePlatformAdmin::class])
    ->group(function () {
        Route::get('tenants', [TenantController::class, 'index'])->name('platform.tenants.index');
        Route::get('tenants/{tenant}', [TenantController::class, 'show'])->name('platform.tenants.show');
        Route::patch('tenants/{tenant}/status', [TenantController::class, 'updateStatus'])->name('platform.tenants.updateStatus');
    });
