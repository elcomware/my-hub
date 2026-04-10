<?php

namespace Database\Factories;

use App\Models\AppCategory;
use App\Models\Team;
use App\Models\TeamApp;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<TeamApp>
 */
class TeamAppFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     */
    protected $model = TeamApp::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'team_id' => Team::factory(),
            'category_id' => null,
            'name' => fake()->words(2, true),
            'url' => fake()->url(),
            'icon' => null,
            'description' => fake()->sentence(),
            'visibility_roles' => null,
            'sort_order' => 0,
            'is_external' => true,
        ];
    }

    /**
     * Associate the app with a category.
     */
    public function inCategory(AppCategory $category): static
    {
        return $this->state(fn () => [
            'category_id' => $category->id,
            'team_id' => $category->team_id,
        ]);
    }
}
