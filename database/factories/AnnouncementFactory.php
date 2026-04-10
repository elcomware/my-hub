<?php

namespace Database\Factories;

use App\Models\Announcement;
use App\Models\Team;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Announcement>
 */
class AnnouncementFactory extends Factory
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
            'author_id' => User::factory(),
            'title' => fake()->sentence(),
            'body' => fake()->paragraphs(3, true),
            'target_audiences' => null,
            'tag' => fake()->randomElement(['info', 'urgent', 'event', 'operational']),
            'is_draft' => false,
            'published_at' => now(),
        ];
    }

    /**
     * Indicate that the announcement is a draft.
     */
    public function draft(): static
    {
        return $this->state(fn () => [
            'is_draft' => true,
            'published_at' => null,
        ]);
    }

    /**
     * Indicate that the announcement is urgent.
     */
    public function urgent(): static
    {
        return $this->state(fn () => [
            'tag' => 'urgent',
        ]);
    }
}
