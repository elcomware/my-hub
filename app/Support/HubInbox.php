<?php

namespace App\Support;

use App\Models\Team;

class HubInbox
{
    /**
     * Build inbox items that mirror the branded mockup.
     *
     * @return array<int, array<string, int|string>>
     */
    public static function itemsFor(Team $team): array
    {
        $availableApps = $team->apps()
            ->pluck('name')
            ->map(fn (string $name) => strtolower($name))
            ->all();

        $catalog = [
            [
                'id' => 1,
                'app' => 'Slack',
                'icon' => '💬',
                'iconBg' => '#EBF4FD',
                'from' => 'Slack — #operations',
                'time' => '9:12',
                'subject' => 'Jordan: “Can we approve the launch checklist today?”',
                'preview' => '+4 messages in this channel',
                'unreadCount' => 5,
            ],
            [
                'id' => 2,
                'app' => 'Email',
                'icon' => '📧',
                'iconBg' => '#FEF9EC',
                'from' => 'Email',
                'time' => '8:55',
                'subject' => 'Client onboarding pack — updated checklist',
                'preview' => 'Please review the revised launch requirements…',
                'unreadCount' => 6,
            ],
            [
                'id' => 3,
                'app' => 'Support',
                'icon' => '📞',
                'iconBg' => '#EBF8EF',
                'from' => 'Support Desk',
                'time' => '8:40',
                'subject' => 'Priority ticket escalated for finance workspace',
                'preview' => '+2 updates',
                'unreadCount' => 3,
            ],
            [
                'id' => 4,
                'app' => 'Calendar',
                'icon' => '📅',
                'iconBg' => '#F0EFFE',
                'from' => 'Calendar',
                'time' => 'Today',
                'subject' => 'Reminder: leadership sync at 14:00',
                'preview' => 'Boardroom B12 · 1h · 8 attendees',
                'unreadCount' => 0,
            ],
        ];

        $items = collect($catalog)
            ->filter(fn (array $item) => in_array(strtolower($item['app']), $availableApps, true))
            ->map(fn (array $item) => collect($item)->except('app')->all())
            ->values()
            ->all();

        if ($items !== []) {
            return $items;
        }

        return collect($catalog)
            ->map(fn (array $item) => collect($item)->except('app')->all())
            ->all();
    }

    public static function unreadCountFor(Team $team): int
    {
        return collect(static::itemsFor($team))
            ->sum(fn (array $item) => (int) ($item['unreadCount'] ?? 0));
    }
}
