<?php

namespace App\Models;

use Database\Factories\TeamAppFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['team_id', 'category_id', 'name', 'url', 'icon', 'description', 'visibility_roles', 'sort_order', 'is_external'])]
class TeamApp extends Model
{
    /** @use HasFactory<TeamAppFactory> */
    use HasFactory;

    /**
     * The table associated with the model.
     */
    protected $table = 'team_apps';

    /**
     * Get the team that owns this app.
     *
     * @return BelongsTo<Team, $this>
     */
    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    /**
     * Get the category of this app.
     *
     * @return BelongsTo<AppCategory, $this>
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(AppCategory::class, 'category_id');
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'visibility_roles' => 'array',
            'is_external' => 'boolean',
        ];
    }
}
