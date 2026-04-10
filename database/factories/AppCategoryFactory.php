<?php

namespace Database\Factories;

use App\Models\AppCategory;
use App\Models\Team;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<AppCategory>
 */
class AppCategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'team_id' => Team::factory(),
            'name' => fake()->randomElement(['Productivity', 'Communication', 'HR', 'Finance', 'Operations']),
            'icon' => null,
            'sort_order' => 0,
        ];
    }
}
