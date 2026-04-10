<?php

namespace App\Support;

use App\Models\Team;

class HubInbox
{
    /**
     * Retrieve inbox items for a team from connected integrations.
     *
     * Currently returns sample items seeded from the team's app catalog.
     * When real integration adapters are built (US-024), each connected
     * provider will contribute its own items through a common contract.
     *
     * @return array<int, array<string, int|string>>
     */
    public static function itemsFor(Team $team): array
    {
        $apps = $team->apps()
            ->select(['id', 'name', 'icon'])
            ->limit(6)
            ->get();

        if ($apps->isEmpty()) {
            return [];
        }

        $templates = [
            ['subject' => 'New activity in %s', 'preview' => 'You have updates waiting for review.'],
            ['subject' => 'Reminder from %s', 'preview' => 'Check your pending tasks before end of day.'],
            ['subject' => 'Update from %s', 'preview' => 'Recent changes require your attention.'],
            ['subject' => '%s - action needed', 'preview' => 'An item is waiting for your approval.'],
            ['subject' => 'Weekly digest from %s', 'preview' => 'Here is what happened this week.'],
            ['subject' => 'Alert from %s', 'preview' => 'A new notification was triggered.'],
        ];

        $defaultBgs = ['#EBF4FD', '#FEF9EC', '#EBF8EF', '#F0EFFE', '#FFF0F0', '#F5F2ED'];

        return $apps->values()->map(function ($app, $i) use ($templates, $defaultBgs) {
            $tpl = $templates[$i % count($templates)];
            return [
                'id' => $app->id,
                'icon' => $app->icon ?: "\u{1F4E6}",
                'iconBg' => $defaultBgs[$i % count($defaultBgs)],
                'from' => $app->name,
                'time' => now()->subMinutes(rand(5, 480))->format('H:i'),
                'subject' => sprintf($tpl['subject'], $app->name),
                'preview' => $tpl['preview'],
                'unreadCount' => rand(0, 5),
            ];
        })->all();
    }

    /**
     * Get total unread count across all inbox sources.
     */
    public static function unreadCountFor(Team $team): int
    {
        return collect(static::itemsFor($team))
            ->sum(fn (array $item) => (int) ($item['unreadCount'] ?? 0));
    }
}