<?php

namespace Database\Seeders;

use App\Enums\TeamRole;
use App\Models\Announcement;
use App\Models\AppCategory;
use App\Models\Team;
use App\Models\TeamApp;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DemoSeeder extends Seeder
{
    /**
     * Seed a demo organisation with sample data.
     */
    public function run(): void
    {
        $team = Team::updateOrCreate(
            ['slug' => 'lumahub-demo'],
            [
                'name' => 'LumaHub',
                'is_personal' => false,
                'logo_path' => '/lumahub-demo-logo.svg',
                'primary_color' => '#252525',
                'accent_color' => '#3A9828',
                'description' => 'branded organisation portal',
                'status' => 'active',
                'sector' => 'North Region',
            ],
        );

        $admin = User::updateOrCreate(
            ['email' => 'admin@acme.test'],
            [
                'name' => 'Alex Morgan',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ],
        );

        $member = User::updateOrCreate(
            ['email' => 'member@acme.test'],
            [
                'name' => 'Jordan Lee',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ],
        );

        $team->members()->syncWithoutDetaching([
            $admin->id => ['role' => TeamRole::Owner->value],
            $member->id => ['role' => TeamRole::Member->value],
        ]);

        $admin->update(['current_team_id' => $team->id]);
        $member->update(['current_team_id' => $team->id]);

        foreach ([$admin, $member] as $user) {
            $personalTeam = Team::firstOrCreate([
                'name' => $user->name."'s Team",
                'is_personal' => true,
            ]);

            $personalTeam->members()->syncWithoutDetaching([
                $user->id => ['role' => TeamRole::Owner->value],
            ]);
        }

        $admin->favouriteApps()->detach();
        $admin->recentApps()->detach();
        Announcement::withTrashed()->where('team_id', $team->id)->forceDelete();
        TeamApp::where('team_id', $team->id)->delete();
        AppCategory::where('team_id', $team->id)->delete();

        $categories = [
            'Communication' => AppCategory::create([
                'team_id' => $team->id,
                'name' => 'Communication',
                'icon' => '💬',
                'sort_order' => 0,
            ]),
            'Operations' => AppCategory::create([
                'team_id' => $team->id,
                'name' => 'Operations',
                'icon' => '📊',
                'sort_order' => 1,
            ]),
            'Resources' => AppCategory::create([
                'team_id' => $team->id,
                'name' => 'Resources',
                'icon' => '📁',
                'sort_order' => 2,
            ]),
        ];

        $apps = collect([
            ['category' => 'Communication', 'name' => 'Slack', 'icon' => '💬', 'url' => 'https://slack.example.com', 'description' => 'Team messaging and channels.', 'sort_order' => 0],
            ['category' => 'Communication', 'name' => 'Support', 'icon' => '📞', 'url' => 'https://support.example.com', 'description' => 'Support desk and escalations.', 'sort_order' => 1],
            ['category' => 'Communication', 'name' => 'Email', 'icon' => '📧', 'url' => 'https://mail.example.com', 'description' => 'Shared email and notifications.', 'sort_order' => 2],
            ['category' => 'Communication', 'name' => 'Outlook', 'icon' => '📮', 'url' => 'https://outlook.example.com', 'description' => 'Calendar and enterprise mail.', 'sort_order' => 3],
            ['category' => 'Operations', 'name' => 'HR', 'icon' => '👥', 'url' => 'https://hr.example.com', 'description' => 'People operations and requests.', 'sort_order' => 0],
            ['category' => 'Operations', 'name' => 'CRM', 'icon' => '📊', 'url' => 'https://crm.example.com', 'description' => 'Client and relationship tracking.', 'sort_order' => 1],
            ['category' => 'Operations', 'name' => 'Finance', 'icon' => '💼', 'url' => 'https://finance.example.com', 'description' => 'Approvals, budgets, and reporting.', 'sort_order' => 2],
            ['category' => 'Operations', 'name' => 'Projects', 'icon' => '📋', 'url' => 'https://projects.example.com', 'description' => 'Projects, roadmaps, and delivery.', 'sort_order' => 3],
            ['category' => 'Operations', 'name' => 'Billing', 'icon' => '🧾', 'url' => 'https://billing.example.com', 'description' => 'Invoices and payment operations.', 'sort_order' => 4],
            ['category' => 'Operations', 'name' => 'Reports', 'icon' => '📈', 'url' => 'https://reports.example.com', 'description' => 'Dashboards and exports.', 'sort_order' => 5],
            ['category' => 'Resources', 'name' => 'Calendar', 'icon' => '📅', 'url' => 'https://calendar.example.com', 'description' => 'Events, planning, and schedules.', 'sort_order' => 0],
            ['category' => 'Resources', 'name' => 'Drive', 'icon' => '📁', 'url' => 'https://drive.example.com', 'description' => 'Files and shared folders.', 'sort_order' => 1],
            ['category' => 'Resources', 'name' => 'Docs', 'icon' => '📝', 'url' => 'https://docs.example.com', 'description' => 'Collaborative documents and notes.', 'sort_order' => 2],
            ['category' => 'Resources', 'name' => 'Meet', 'icon' => '🎥', 'url' => 'https://meet.example.com', 'description' => 'Meetings and video conferencing.', 'sort_order' => 3],
            ['category' => 'Resources', 'name' => 'Intranet', 'icon' => '🏢', 'url' => 'https://intranet.example.com', 'description' => 'Company resources and policies.', 'sort_order' => 4],
        ])->map(function (array $app) use ($team, $categories) {
            return TeamApp::create([
                'team_id' => $team->id,
                'category_id' => $categories[$app['category']]->id,
                'name' => $app['name'],
                'url' => $app['url'],
                'icon' => $app['icon'],
                'description' => $app['description'],
                'sort_order' => $app['sort_order'],
                'is_external' => true,
            ]);
        });

        $favouriteNames = ['Slack', 'Support', 'Email', 'Calendar', 'HR', 'CRM', 'Finance'];
        $recentNames = ['Slack', 'Finance', 'Calendar'];

        $admin->favouriteApps()->sync(
            $apps->filter(fn (TeamApp $app) => in_array($app->name, $favouriteNames, true))->pluck('id')->all(),
        );

        $admin->recentApps()->sync(
            $apps->filter(fn (TeamApp $app) => in_array($app->name, $recentNames, true))
                ->mapWithKeys(fn (TeamApp $app, int $index) => [
                    $app->id => ['launched_at' => now()->subMinutes(($index + 1) * 25)],
                ])
                ->all(),
        );

        $announcements = collect([
            [
                'title' => 'Workspace access policy updated',
                'body' => 'All managers must review new access approvals before 3:00 PM.',
                'tag' => 'urgent',
                'published_at' => now()->subHours(2),
            ],
            [
                'title' => 'Quarterly planning review — 28 April',
                'body' => 'Department leads should confirm attendance and submit agenda items by Friday.',
                'tag' => 'event',
                'published_at' => now()->subDay()->setTime(14, 0),
            ],
            [
                'title' => 'Scheduled maintenance — Saturday 22:00–24:00',
                'body' => 'The analytics workspace will be unavailable for 2 hours. No action required.',
                'tag' => 'info',
                'published_at' => now()->subDays(4)->setTime(9, 0),
            ],
            [
                'title' => 'Time-off requests — June window open',
                'body' => 'Submit your requests through the HR workspace before 30 April.',
                'tag' => 'operational',
                'published_at' => now()->subDays(8),
            ],
            [
                'title' => 'Leadership forum — 30 April',
                'body' => 'Regional leads should bring one customer insight and one risk update to the session.',
                'tag' => 'event',
                'published_at' => now()->subDays(20),
            ],
            [
                'title' => 'Finance cut-off reminder',
                'body' => 'Expense claims submitted after Friday 17:00 will roll into next month’s cycle.',
                'tag' => 'info',
                'published_at' => now()->subDays(10),
            ],
            [
                'title' => 'CRM segmentation refresh complete',
                'body' => 'The operations team has published the new customer segments in CRM.',
                'tag' => 'operational',
                'published_at' => now()->subDays(12),
            ],
            [
                'title' => 'Brand pack approved for partner portal',
                'body' => 'The new logo, palette, and sign-in imagery are ready for rollout.',
                'tag' => 'info',
                'published_at' => now()->subDays(14),
            ],
            [
                'title' => 'Drive cleanup window opens Monday',
                'body' => 'Archive outdated folders before the storage quota review on Friday.',
                'tag' => 'operational',
                'published_at' => now()->subDays(16),
            ],
            [
                'title' => 'New starter checklist updated',
                'body' => 'Managers can now complete onboarding actions directly from the HR workspace.',
                'tag' => 'info',
                'published_at' => now()->subDays(18),
            ],
            [
                'title' => 'Monthly support SLA review published',
                'body' => 'Average first-response time improved by 11% compared with last month.',
                'tag' => 'operational',
                'published_at' => now()->subDays(22),
            ],
            [
                'title' => 'Workspace naming convention reminder',
                'body' => 'Use the updated department prefixes when creating folders and projects.',
                'tag' => 'info',
                'published_at' => now()->subDays(25),
            ],
            [
                'title' => 'Project archive completed for Q1 initiatives',
                'body' => 'Closed delivery boards are now available in the archive workspace.',
                'tag' => 'operational',
                'published_at' => now()->subDays(28),
            ],
            [
                'title' => 'Knowledge base refresh available',
                'body' => 'Search quality has improved after the latest docs indexing pass.',
                'tag' => 'info',
                'published_at' => now()->subDays(32),
            ],
            [
                'title' => 'People operations office hours',
                'body' => 'Drop-in support for policy questions is available each Thursday at 11:00.',
                'tag' => 'info',
                'published_at' => now()->subDays(36),
            ],
        ])->map(function (array $announcement) use ($team, $admin) {
            return Announcement::create([
                'team_id' => $team->id,
                'author_id' => $admin->id,
                'title' => $announcement['title'],
                'body' => $announcement['body'],
                'tag' => $announcement['tag'],
                'is_draft' => false,
                'published_at' => $announcement['published_at'],
            ]);
        });

        $readAnnouncement = $announcements->last();

        if ($readAnnouncement) {
            $readAnnouncement->readers()->syncWithoutDetaching([
                $admin->id => ['read_at' => now()->subDay()],
            ]);
        }
    }
}
