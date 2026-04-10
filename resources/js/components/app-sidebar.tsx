import { Link, usePage } from '@inertiajs/react';
import {
    AppWindow,
    BookOpen,
    FolderGit2,
    Home,
    LayoutGrid,
    Megaphone,
    Palette,
    Settings,
    Shield,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { TeamSwitcher } from '@/components/team-switcher';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

export function AppSidebar() {
    const page = usePage();
    const currentTeam = page.props.currentTeam;
    const teamSlug = currentTeam?.slug ?? '';
    const dashboardUrl = currentTeam ? dashboard(teamSlug) : '/';

    const role = currentTeam?.role;
    const isAdminOrAbove =
        role === 'owner' || role === 'admin' || role === 'manager';

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboardUrl,
            icon: LayoutGrid,
        },
        {
            title: 'Hub Home',
            href: `/${teamSlug}/hub`,
            icon: Home,
        },
        {
            title: 'Apps',
            href: `/${teamSlug}/apps`,
            icon: AppWindow,
        },
        {
            title: 'Announcements',
            href: `/${teamSlug}/announcements`,
            icon: Megaphone,
        },
    ];

    const adminNavItems: NavItem[] = isAdminOrAbove
        ? [
              {
                  title: 'Manage Apps',
                  href: `/${teamSlug}/admin/apps`,
                  icon: Settings,
              },
              {
                  title: 'Manage Announcements',
                  href: `/${teamSlug}/admin/announcements`,
                  icon: Shield,
              },
              {
                  title: 'Branding',
                  href: `/${teamSlug}/admin/branding`,
                  icon: Palette,
              },
          ]
        : [];

    const footerNavItems: NavItem[] = [
        {
            title: 'Repository',
            href: 'https://github.com/laravel/react-starter-kit',
            icon: FolderGit2,
        },
        {
            title: 'Documentation',
            href: 'https://laravel.com/docs/starter-kits#react',
            icon: BookOpen,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboardUrl} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <TeamSwitcher />
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
                {adminNavItems.length > 0 && (
                    <>
                        <SidebarSeparator />
                        <NavMain items={adminNavItems} label="Administration" />
                    </>
                )}
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
