<?php

use App\Http\Controllers\Admin\AnnouncementManagementController;
use App\Http\Controllers\Admin\AppManagementController;
use App\Http\Controllers\Admin\BrandingController;
use App\Http\Controllers\Hub\AnnouncementFeedController;
use App\Http\Controllers\Hub\AppCatalogController;
use App\Http\Controllers\Hub\HubController;
use App\Http\Controllers\Hub\InboxController;
use App\Http\Controllers\Hub\ProfileController;
use App\Http\Controllers\Teams\TeamInvitationController;
use App\Http\Middleware\EnsureTeamMembership;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::prefix('{current_team}')
    ->middleware(['auth', 'verified', EnsureTeamMembership::class])
    ->group(function () {
        Route::inertia('dashboard', 'dashboard')->name('dashboard');

        // Hub routes
        Route::get('hub', [HubController::class, 'index'])->name('hub.index');
        Route::get('apps', [AppCatalogController::class, 'index'])->name('hub.apps.index');
        Route::post('apps/{app}/favourite', [AppCatalogController::class, 'toggleFavourite'])->name('hub.apps.favourite');
        Route::post('apps/{app}/launch', [AppCatalogController::class, 'launch'])->name('hub.apps.launch');
        Route::get('announcements', [AnnouncementFeedController::class, 'index'])->name('hub.announcements.index');
        Route::get('announcements/{announcement}', [AnnouncementFeedController::class, 'show'])->name('hub.announcements.show');
        Route::post('announcements/mark-all-read', [AnnouncementFeedController::class, 'markAllRead'])->name('hub.announcements.markAllRead');
        Route::get('inbox', [InboxController::class, 'index'])->name('hub.inbox.index');
        Route::get('profile', [ProfileController::class, 'index'])->name('hub.profile.index');

        // Admin routes (require admin role)
        Route::prefix('admin')
            ->middleware(EnsureTeamMembership::class.':manager')
            ->group(function () {
                Route::get('apps', [AppManagementController::class, 'index'])->name('admin.apps.index');
                Route::post('apps', [AppManagementController::class, 'store'])->name('admin.apps.store');
                Route::patch('apps/{app}', [AppManagementController::class, 'update'])->name('admin.apps.update');
                Route::delete('apps/{app}', [AppManagementController::class, 'destroy'])->name('admin.apps.destroy');

                Route::get('announcements', [AnnouncementManagementController::class, 'index'])->name('admin.announcements.index');
                Route::post('announcements', [AnnouncementManagementController::class, 'store'])->name('admin.announcements.store');
                Route::patch('announcements/{announcement}', [AnnouncementManagementController::class, 'update'])->name('admin.announcements.update');
                Route::delete('announcements/{announcement}', [AnnouncementManagementController::class, 'destroy'])->name('admin.announcements.destroy');

                Route::get('branding', [BrandingController::class, 'edit'])->name('admin.branding.edit');
                Route::patch('branding', [BrandingController::class, 'update'])->name('admin.branding.update');
            });
    });

Route::middleware(['auth'])->group(function () {
    Route::get('invitations/{invitation}/accept', [TeamInvitationController::class, 'accept'])->name('invitations.accept');
});

require __DIR__.'/settings.php';
