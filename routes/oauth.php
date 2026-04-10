<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\OAuthController;

Route::get('auth/{provider}/redirect', [OAuthController::class, 'redirect'])->name('oauth.redirect');
Route::get('auth/{provider}/callback', [OAuthController::class, 'callback'])->name('oauth.callback');
Route::post('auth/{provider}/disconnect', [OAuthController::class, 'disconnect'])->middleware('auth')->name('oauth.disconnect');
