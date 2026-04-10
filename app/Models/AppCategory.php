<?php

namespace App\Models;

use Database\Factories\AppCategoryFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['team_id', 'name', 'icon', 'sort_order'])]
class AppCategory extends Model
{
    /** @use HasFactory<AppCategoryFactory> */
    use HasFactory;

    /**
     * Get the team that owns this category.
     *
     * @return BelongsTo<Team, $this>
     */
    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    /**
     * Get the apps in this category.
     *
     * @return HasMany<TeamApp, $this>
     */
    public function apps(): HasMany
    {
        return $this->hasMany(TeamApp::class, 'category_id');
    }
}
