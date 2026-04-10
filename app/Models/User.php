<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Concerns\HasTeams;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

#[Fillable(['name', 'email', 'password', 'current_team_id', 'onboarding_completed_at', 'is_platform_admin'])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable
{
    /**
     * Get the user's device tokens for push notifications.
     */
    public function deviceTokens()
    {
        return $this->hasMany(DeviceToken::class);
    }
    /**
     * Return a list of connected OAuth providers for this user.
     *
     * @return array<string>
     */
    public function connectedProviders(): array
    {
        $providers = [];
        if ($this->provider && $this->provider_id) {
            $providers[] = $this->provider;
        }
        // Extend here for multi-provider support in future
        return $providers;
    }

    /**
     * Is the user connected to a given provider?
     */
    public function isConnectedTo(string $provider): bool
    {
        return $this->provider === $provider && !empty($this->provider_id);
    }
    /** @use HasFactory<UserFactory> */
    use HasFactory, HasTeams, Notifiable, TwoFactorAuthenticatable;

    /**
     * Get the user's favourite apps.
     *
     * @return BelongsToMany<TeamApp, $this>
     */
    public function favouriteApps(): BelongsToMany
    {
        return $this->belongsToMany(TeamApp::class, 'user_app_favourites', 'user_id', 'app_id')
            ->withTimestamps();
    }

    /**
     * Get the user's recently launched apps.
     *
     * @return BelongsToMany<TeamApp, $this>
     */
    public function recentApps(): BelongsToMany
    {
        return $this->belongsToMany(TeamApp::class, 'user_app_recents', 'user_id', 'app_id')
            ->withPivot('launched_at')
            ->orderByPivot('launched_at', 'desc');
    }

    /**
     * Get the user's notification preferences.
     *
     * @return HasMany<NotificationPreference, $this>
     */
    public function notificationPreferences(): HasMany
    {
        return $this->hasMany(NotificationPreference::class);
    }

    /**
     * Determine if the user has completed onboarding.
     */
    public function hasCompletedOnboarding(): bool
    {
        return $this->onboarding_completed_at !== null;
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'onboarding_completed_at' => 'datetime',
            'is_platform_admin' => 'boolean',
        ];
    }
}
