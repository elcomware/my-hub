# Archived — Cours Lumière Hub School-Specific Scrum Plan

**Project:** Cours Lumière Hub (original school-specific concept)
**Stack:** Laravel + Inertia.js + React + Tailwind CSS + MySQL
**Hosting:** Single server (VPS or shared hosting)
**Version:** 1.0
**Last updated:** April 2026

> **Legacy note:** this file preserves the original school-specific plan for reference.
>
> **Current direction:** the active product is now **LumaHub**, a multi-tenant, white-label SaaS hub for any organisation. Use `../saas-hub-product-vision.md` for the product vision and `../lumahub-saas-scrum-plan.md` for the canonical agile delivery plan.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Team Roles](#2-team-roles)
3. [Scrum Ceremonies](#3-scrum-ceremonies)
4. [Definition of Ready & Done](#4-definition-of-ready--done)
5. [Epics](#5-epics)
6. [Product Backlog — Full User Stories](#6-product-backlog--full-user-stories)
7. [Sprint Plan](#7-sprint-plan)
8. [Technical Conventions](#8-technical-conventions)
9. [Non-Functional Requirements](#9-non-functional-requirements)
10. [Risks & Mitigations](#10-risks--mitigations)

---

## 1. Project Overview

### Problem
Cours Lumière staff, parents and students currently manage 25+ separate platforms (Slack, WhatsApp, Personio, AEFE, Enko, Gmail, etc.) with no central point of access. Updates are fragmented, notifications are missed, and the team has limited technical capacity to manage multiple tools.

### Solution
A Progressive Web App (PWA) that acts as a single hub:
- One-tap access to every platform via organised tiles
- A unified inbox aggregating messages from Gmail and Calendar
- A school-wide announcements board posted by admins only
- Push notifications for urgent updates
- Installable on any phone or computer, no app store required

### Audiences

| Audience | Role in the app |
|---|---|
| Admin / Direction | Post announcements, manage users and platform tiles |
| Teaching staff | Read updates, access tools, receive notifications |
| Parents | Read announcements, access relevant platforms |
| Students | Read announcements, access student-facing tools |

### Success metrics
- 80% of staff install the PWA within 4 weeks of launch
- Admin posts announcements here instead of sending separate WhatsApp/email blasts
- Average time to find a platform tool drops to under 10 seconds

---

## 2. Team Roles

| Role | Responsibilities |
|---|---|
| **Product Owner (PO)** | Owns the backlog. Prioritises stories. Accepts or rejects completed work. Represents the school's needs. |
| **Scrum Master (SM)** | Facilitates ceremonies. Removes blockers. Protects the team from scope creep. |
| **Lead Developer** | Laravel backend, API design, database, authentication, push notifications. |
| **Frontend Developer** | React + Inertia components, Tailwind styling, PWA configuration. |
| **QA / Tester** | Writes and runs test cases. Validates acceptance criteria. Performs cross-device testing. |
| **School Admin Representative** | Domain expert. Available for questions. Reviews designs and content. |

> For small teams, one developer may cover both Lead and Frontend roles. The SM role can be shared with the PO on small teams.

---

## 3. Scrum Ceremonies

### Sprint length
**2 weeks** per sprint.

### Ceremony schedule

| Ceremony | When | Duration | Who |
|---|---|---|---|
| Sprint Planning | Monday, start of sprint | 2 hours | Whole team |
| Daily Standup | Every weekday | 15 min | Dev team + SM |
| Sprint Review | Friday, end of sprint | 1 hour | Whole team + stakeholders |
| Sprint Retrospective | Friday, end of sprint (after review) | 45 min | Dev team + SM |
| Backlog Refinement | Wednesday, mid-sprint | 1 hour | PO + dev team |

### Daily standup format
Each person answers three questions:
1. What did I complete yesterday?
2. What am I working on today?
3. Is anything blocking me?

### Sprint Review format
- Demo of completed stories on a real device (phone + desktop)
- PO accepts or rejects each story
- Rejected stories return to the backlog with feedback

---

## 4. Definition of Ready & Done

### Definition of Ready (before a story enters a sprint)
A story is ready to be picked up when:
- [ ] It has a clear title and description
- [ ] Acceptance criteria are written and agreed
- [ ] It has been estimated (story points)
- [ ] Any dependencies are identified
- [ ] UI mockup or design reference is available (for frontend stories)

### Definition of Done (before a story is marked complete)
A story is done when:
- [ ] Code is written and reviewed by at least one other developer
- [ ] All acceptance criteria are met
- [ ] Unit or feature tests are written and passing
- [ ] Tested on mobile (Android + iOS) and desktop (Chrome + Safari)
- [ ] No critical console errors or warnings
- [ ] Merged to `main` branch via pull request
- [ ] PO has accepted the story in the sprint review

---

## 5. Epics

| # | Epic | Description |
|---|---|---|
| E1 | **Project foundation** | Repository, Laravel setup, database, deployment pipeline |
| E2 | **Authentication & user roles** | Login, Google OAuth, role management (admin, teacher, parent, student) |
| E3 | **Platform tiles** | Hub home screen, app grid, tile management by admin |
| E4 | **Announcements board** | Admin posts, all users read, tagging, search |
| E5 | **Unified inbox** | Gmail and Google Calendar aggregation |
| E6 | **Push notifications** | Web push (browser-based, no Firebase) for new announcements |
| E7 | **PWA & offline** | Installable, offline fallback, app icon, splash screen |
| E8 | **Admin panel** | Manage users, roles, platform tiles, post announcements |
| E9 | **Notifications preferences** | Per-user settings for what they receive |
| E10 | **Polish & launch** | Performance, onboarding, user guide, production deployment |

---

## 6. Product Backlog — Full User Stories

Story point scale: 1 (trivial) · 2 (small) · 3 (medium) · 5 (large) · 8 (very large)

---

### Epic E1 — Project Foundation

---

**US-001 — Project scaffold**
As a developer, I want the project repository initialised with Laravel + Inertia + React + Tailwind so that the team has a consistent base to build on.

**Acceptance criteria:**
- `laravel new cours-lumiere-hub` run with React starter kit
- Tailwind CSS configured and working
- Inertia.js installed and rendering a test React page
- `.env.example` file committed with all required keys documented
- README with local setup instructions (clone → install → migrate → run)
- Git repository created with `main` and `develop` branches
- Branch protection on `main` (requires pull request)

**Story points:** 3

---

**US-002 — Database schema**
As a developer, I want the core database tables created via migrations so that all features have a reliable data foundation.

**Acceptance criteria:**
- Migrations exist for: `users`, `roles`, `platform_tiles`, `announcements`, `push_subscriptions`, `announcement_reads`
- All migrations run cleanly with `php artisan migrate`
- Seeders create one admin user, one teacher, one parent, one student for testing
- Schema documented in README

**Story points:** 3

---

**US-003 — CI/CD pipeline**
As a developer, I want automated deployment so that every merge to `main` deploys to the server without manual steps.

**Acceptance criteria:**
- GitHub Actions (or equivalent) workflow file committed
- On push to `main`: runs tests, then deploys to server via SSH
- Deployment runs `composer install`, `npm run build`, `php artisan migrate --force`
- Failed deployments send an alert (email or Slack)

**Story points:** 5

---

**US-004 — Environment & hosting setup**
As a developer, I want the production server configured so that the app runs securely over HTTPS.

**Acceptance criteria:**
- Server provisioned (VPS or shared hosting)
- PHP 8.2+, MySQL, Nginx/Apache configured
- SSL certificate installed (Let's Encrypt)
- App accessible at school domain (e.g. hub.courslumiere.com)
- `.env` production values set (APP_KEY, DB credentials, mail config)

**Story points:** 5

---

### Epic E2 — Authentication & User Roles

---

**US-005 — Email/password login**
As a user, I want to log in with my email and password so that I can access the hub securely.

**Acceptance criteria:**
- Login page at `/login` with email + password fields
- Incorrect credentials show a clear error message
- Successful login redirects to the home screen
- Session persists for 30 days (remember me)
- Logout button accessible from the profile screen

**Story points:** 3

---

**US-006 — Google OAuth login**
As a staff member, I want to sign in with my school Google account so that I don't need to remember a separate password.

**Acceptance criteria:**
- "Sign in with Google" button on the login page
- Uses Laravel Socialite with Google provider
- First-time login creates a user account automatically
- Returning users are matched by email
- If Google account email is not on the approved domain, access is denied with a clear message

**Story points:** 5

---

**US-007 — User roles**
As an admin, I want to assign roles to users so that each person sees only what is relevant to them.

**Acceptance criteria:**
- Four roles exist: `admin`, `teacher`, `parent`, `student`
- Roles managed via `spatie/laravel-permission`
- Admin can change any user's role from the admin panel
- Routes and UI elements are protected by role middleware
- A user without a role sees a "pending approval" screen after login

**Story points:** 3

---

**US-008 — Password reset**
As a user, I want to reset my password by email so that I can recover my account if I forget it.

**Acceptance criteria:**
- "Forgot password" link on the login page
- Reset email sent within 60 seconds
- Reset link expires after 60 minutes
- After reset, user is redirected to login
- Works with Laravel's built-in password reset system

**Story points:** 2

---

**US-009 — First-time onboarding screen**
As a new user, I want a short welcome screen on first login so that I understand what the app does.

**Acceptance criteria:**
- Shown only once, on first login
- 3 slides: "Your school hub", "All your tools in one place", "Stay informed"
- Skip button available on every slide
- Ends with "Install the app" prompt (PWA install)
- State stored in user profile so it doesn't repeat

**Story points:** 3

---

### Epic E3 — Platform Tiles

---

**US-010 — Home screen with platform tiles**
As a user, I want to see all my school platforms as tiles on the home screen so that I can reach any tool in one tap.

**Acceptance criteria:**
- Home screen shows a grid of platform tiles (4 columns on mobile)
- Each tile has an icon (emoji or image), name, and optional badge count
- Tapping a tile opens the platform (deep link or embedded webview)
- Tiles are ordered by admin-defined priority
- Loading state shown while tiles fetch

**Story points:** 5

---

**US-011 — Tiles organised by category**
As a user, I want tiles grouped into categories (Communication, Administration, Resources) so that I find what I need faster.

**Acceptance criteria:**
- Categories displayed as section headers above their tile groups
- Default categories: Communication, Administration, Resources
- Admin can create, rename, and delete categories
- Tiles can be moved between categories
- Categories with no tiles are hidden

**Story points:** 3

---

**US-012 — Admin manages platform tiles**
As an admin, I want to add, edit, and remove platform tiles so that the hub always reflects the tools the school actually uses.

**Acceptance criteria:**
- Admin panel has a tile management screen
- Admin can add a tile: name, URL, icon (emoji or upload), category, visible to (all / specific roles)
- Admin can edit or delete any tile
- Changes are live immediately for all users
- Tile URLs validated on save (must be a valid URL)

**Story points:** 5

---

**US-013 — Role-based tile visibility**
As an admin, I want to show certain tiles only to specific roles so that parents don't see admin-only tools.

**Acceptance criteria:**
- Each tile has a "visible to" setting: All, Admin, Teachers, Parents, Students (multi-select)
- Users only see tiles assigned to their role
- Admin always sees all tiles
- Role visibility editable per tile in admin panel

**Story points:** 3

---

**US-014 — User pins favourite tiles**
As a user, I want to pin my most-used platforms to the top of my home screen so that I reach them even faster.

**Acceptance criteria:**
- Long-press (or edit mode button) on any tile reveals a "pin" option
- Up to 8 tiles can be pinned
- Pinned tiles appear in a "Quick access" row at the top
- Pin state saved per user, persists across sessions and devices

**Story points:** 3

---

**US-015 — Tile search**
As a user, I want to search for a platform by name so that I can find it quickly even if there are many tiles.

**Acceptance criteria:**
- Search bar on the apps screen filters tiles in real time as user types
- Matches on tile name and category
- "No results" state shown when nothing matches
- Search clears on navigation away

**Story points:** 2

---

### Epic E4 — Announcements Board

---

**US-016 — Announcements feed**
As a user, I want to see a feed of school announcements so that I stay informed without checking multiple platforms.

**Acceptance criteria:**
- Announcements feed available from the bottom navigation
- Shows title, author, date, tag (Urgent / Event / Info / Admin), and preview text
- Full announcement opens on tap
- Newest first by default
- Paginated (20 per page, infinite scroll)

**Story points:** 5

---

**US-017 — Admin posts an announcement**
As an admin, I want to write and publish an announcement so that all relevant users are notified immediately.

**Acceptance criteria:**
- Post form has: title, body (rich text), tag, target audience (all / roles), optional event date
- Preview available before publishing
- Announcement appears in the feed immediately on publish
- Push notification triggered on publish (see E6)
- Draft saving supported (post can be saved without publishing)

**Story points:** 5

---

**US-018 — Announcement tags and filtering**
As a user, I want to filter announcements by tag so that I can find urgent items or upcoming events quickly.

**Acceptance criteria:**
- Tags: Urgent, Event, Info, Admin
- Filter bar above the feed with tag chips
- Multiple tags can be active simultaneously
- Active filter persists while on the screen
- Tag colour matches the design system (Urgent = coral, Event = teal, Info = blue, Admin = purple)

**Story points:** 3

---

**US-019 — Mark announcements as read**
As a user, I want announcements to show as unread until I open them so that I know what I haven't seen yet.

**Acceptance criteria:**
- Unread announcements show a blue dot indicator
- Dot disappears when the announcement is opened
- Unread count badge shown on the Updates tab in the bottom navigation
- "Mark all as read" button available
- Read state stored per user in `announcement_reads` table

**Story points:** 3

---

**US-020 — Admin edits or deletes an announcement**
As an admin, I want to edit or remove a published announcement so that I can correct mistakes.

**Acceptance criteria:**
- Edit and delete options visible on each announcement in admin view
- Edited announcement shows "Updated" label with new timestamp
- Deleted announcement disappears from the feed for all users immediately
- Deletion requires a confirmation dialog

**Story points:** 2

---

**US-021 — Announcement search**
As a user, I want to search past announcements by keyword so that I can find something I remember reading before.

**Acceptance criteria:**
- Search bar on the announcements screen
- Full-text search on title and body
- Results highlight the matching keyword
- Empty state with helpful message if no results

**Story points:** 3

---

**US-022 — Audience-targeted announcements**
As an admin, I want to send an announcement only to teachers (or only to parents, etc.) so that irrelevant messages don't clutter other users' feeds.

**Acceptance criteria:**
- Admin selects target audience when posting: All, Teachers, Parents, Students, or Admin only
- Only users in the selected role(s) see the announcement
- Push notification also limited to the target audience
- Audience label shown on the announcement card in admin view

**Story points:** 3

---

### Epic E5 — Unified Inbox

---

**US-023 — Connect Google account**
As a staff member, I want to connect my Google account so that my Gmail and Calendar appear inside the hub.

**Acceptance criteria:**
- "Connect Google" button in profile settings
- OAuth consent screen requests: Gmail read-only, Calendar read-only
- Tokens stored securely (encrypted) in the database
- User can disconnect at any time
- Reconnect flow if token expires

**Story points:** 5

---

**US-024 — Gmail preview in inbox**
As a staff member, I want to see my recent Gmail messages in the hub inbox so that I can check emails without leaving the app.

**Acceptance criteria:**
- Shows last 20 emails: sender, subject, preview, time
- Unread emails shown in bold
- Tapping an email opens Gmail (deep link)
- Badge count shown on the Inbox tab for unread emails
- Data refreshes on pull-to-refresh
- If Google not connected, shows "Connect your Google account" prompt

**Story points:** 5

---

**US-025 — Google Calendar in inbox**
As a staff member, I want to see today's and upcoming calendar events in the inbox so that I don't miss meetings.

**Acceptance criteria:**
- Shows events for today and the next 7 days
- Each event shows: title, time, location (if set), attendee count
- Tapping opens Google Calendar (deep link)
- "No events today" state shown when calendar is empty
- Events refresh on pull-to-refresh

**Story points:** 5

---

**US-026 — Inbox unified view**
As a user, I want a single inbox screen that combines Gmail and Calendar so that I have one place to check what needs attention.

**Acceptance criteria:**
- Inbox screen shows sections: Today's events (top), Recent emails (below)
- Total unread count shown in tab badge (emails + unread announcements)
- Each item clearly labelled by source (Gmail / Calendar / Slack etc.)
- Empty state shown if nothing to display

**Story points:** 3

---

### Epic E6 — Push Notifications

---

**US-027 — Request push notification permission**
As a user, I want the app to ask for notification permission at the right moment so that I can receive alerts.

**Acceptance criteria:**
- Permission request shown after first login, not on landing page
- Brief explanation shown before the browser prompt: "Get notified about urgent school updates"
- If denied, option to enable later in profile settings
- Permission state stored per user
- Works on Android (Chrome) and desktop (Chrome, Firefox, Edge)

**Story points:** 3

---

**US-028 — Push notification on new announcement**
As a user, I want to receive a push notification when an admin posts an announcement so that I see it even if the app is closed.

**Acceptance criteria:**
- Notification sent within 5 seconds of admin publishing
- Notification shows: school name, announcement title, tag
- Tapping notification opens the app directly to that announcement
- Notification only sent to the target audience of the announcement
- Uses `minishlink/web-push` Laravel package

**Story points:** 8

---

**US-029 — Notification for urgent items only (opt-in)**
As a user, I want to receive push notifications only for urgent announcements so that I'm not disturbed by low-priority updates.

**Acceptance criteria:**
- Notification settings in profile: "All announcements" / "Urgent only" / "None"
- Default is "All announcements"
- Laravel checks user preference before sending
- Setting change takes effect immediately (no re-subscription needed)

**Story points:** 3

---

**US-030 — iOS web push support**
As an iPhone user, I want to receive push notifications after adding the app to my home screen so that I don't miss updates.

**Acceptance criteria:**
- App prompts iOS users to "Add to Home Screen" before requesting notification permission
- Prompt shown only on iOS Safari
- Instructions shown (step by step: Share → Add to Home Screen)
- Push notifications work after app is added to home screen (iOS 16.4+)
- Graceful fallback message for older iOS versions

**Story points:** 5

---

### Epic E7 — PWA & Offline

---

**US-031 — PWA manifest**
As a user, I want the app to be installable on my phone like a native app so that I have an icon on my home screen.

**Acceptance criteria:**
- `manifest.json` generated by `vite-plugin-pwa`
- App name: "Cours Lumière Hub"
- Icons at 192×192 and 512×512 (school logo or placeholder)
- Theme colour matches school branding (#1A3A5C)
- `display: standalone` (no browser chrome when installed)
- Install prompt appears on Android Chrome after 2 visits

**Story points:** 3

---

**US-032 — Service worker & offline fallback**
As a user, I want the app to show something useful when I have no internet connection so that it doesn't just show a blank page.

**Acceptance criteria:**
- Service worker registered and active
- Static assets (shell, icons, fonts) cached on first load
- Announcements feed cached for offline reading (last 20 announcements)
- Offline banner shown when connection is lost
- Offline fallback page shows cached announcements if available
- App reconnects and refreshes automatically when connection returns

**Story points:** 5

---

**US-033 — App icon and splash screen**
As a user, I want the installed app to have the school's branding so that it feels like a school tool, not a generic website.

**Acceptance criteria:**
- App icon uses school logo (provided by school admin)
- Splash screen shown on launch (school name + logo)
- Splash screen background matches theme colour
- Icon and splash screen look correct on both Android and iOS

**Story points:** 2

---

### Epic E8 — Admin Panel

---

**US-034 — Admin dashboard**
As an admin, I want a dashboard showing key stats so that I have a quick overview of the hub's usage.

**Acceptance criteria:**
- Dashboard shows: total users, active users (last 7 days), total announcements, total platform tiles
- Recent activity feed (last 10 actions: posts, new users, tile changes)
- Accessible only to users with `admin` role
- Route: `/admin`

**Story points:** 3

---

**US-035 — User management**
As an admin, I want to manage user accounts so that I can add new staff, change roles, or disable accounts.

**Acceptance criteria:**
- User list with search and filter by role
- Admin can: create user, edit role, deactivate account, reset password
- Deactivated users cannot log in
- Invite by email: sends a registration link that expires in 48 hours
- Bulk role assignment (select multiple users → assign role)

**Story points:** 8

---

**US-036 — Announcement management**
As an admin, I want a list of all published and draft announcements so that I can manage past posts.

**Acceptance criteria:**
- List shows: title, tag, audience, date, status (draft / published)
- Filter by status and tag
- Edit, delete, and duplicate actions per row
- "New announcement" button links to the post form (US-017)

**Story points:** 3

---

**US-037 — Platform tile management**
As an admin, I want a tile management screen so that I can keep the app directory up to date.

**Acceptance criteria:**
- See US-012 for full criteria
- Tile list with drag-and-drop ordering within categories
- Changes reflected immediately on all user home screens

**Story points:** 5

---

**US-038 — Notification broadcast**
As an admin, I want to send a manual push notification to all users (or a specific role) so that I can broadcast urgent information instantly.

**Acceptance criteria:**
- "Send notification" form in admin panel: title, message, target audience
- Preview shown before sending
- Confirmation required before broadcast
- Sent notifications logged with timestamp, audience, and sender
- Rate limit: max 5 manual broadcasts per day

**Story points:** 5

---

### Epic E9 — Notification Preferences

---

**US-039 — Notification preferences screen**
As a user, I want a settings screen where I can control exactly what I'm notified about so that I only receive relevant alerts.

**Acceptance criteria:**
- Settings accessible from the profile tab
- Options: All announcements / Urgent only / Events only / None
- Gmail notification badge: on/off
- Calendar reminders: on/off
- Changes saved immediately
- Settings persist across devices (stored in database, not browser)

**Story points:** 3

---

**US-040 — Quiet hours**
As a user, I want to set quiet hours so that I don't receive push notifications during evenings and weekends.

**Acceptance criteria:**
- Quiet hours setting in notification preferences
- User sets start time and end time
- During quiet hours, push notifications are queued and delivered at the end of quiet hours
- Exception: notifications tagged "Urgent" bypass quiet hours
- Default: no quiet hours set

**Story points:** 5

---

### Epic E10 — Polish & Launch

---

**US-041 — Mobile responsiveness audit**
As a user, I want every screen to look correct on my phone so that the app is comfortable to use on small screens.

**Acceptance criteria:**
- All screens tested on: iPhone SE (375px), iPhone 14 (390px), Android mid-range (360px), tablet (768px), desktop (1280px)
- No horizontal scroll on any screen
- Touch targets at least 44×44px
- Font sizes no smaller than 13px
- All interactive elements reachable with one thumb

**Story points:** 5

---

**US-042 — Performance optimisation**
As a user, I want the app to load fast so that I'm not waiting when I open it.

**Acceptance criteria:**
- Lighthouse Performance score ≥ 80 on mobile
- First Contentful Paint under 2 seconds on 4G
- Vite code splitting: each route loads only its own JS
- Images optimised and served in WebP format
- Laravel response caching on announcement feed

**Story points:** 5

---

**US-043 — User guide for non-technical staff**
As a non-technical staff member, I want a simple guide so that I know how to install the app and use it.

**Acceptance criteria:**
- One-page PDF guide created (in French)
- Covers: how to open the app URL, how to install on iPhone, how to install on Android, how to read announcements, how to access a platform
- Guide linked from the app's profile screen
- Also available as a printed handout version

**Story points:** 3

---

**US-044 — Admin guide for posting announcements**
As an admin, I want a guide for posting announcements so that any authorised person can do it confidently.

**Acceptance criteria:**
- Short guide (in French) covering: login as admin, write an announcement, choose audience, add a tag, publish, send push notification
- Guide linked from the admin panel
- Screenshots included

**Story points:** 2

---

**US-045 — Production smoke test & launch**
As the team, we want a verified production deployment so that the school can start using the app confidently.

**Acceptance criteria:**
- All critical user journeys tested end-to-end on production
- Critical journeys: login, view tiles, tap a tile, read announcement, receive push notification, install PWA
- Load test: 100 concurrent users, no errors
- SSL verified
- Backup strategy documented and tested (daily DB backup)
- Go/no-go sign-off from PO before announcing to school

**Story points:** 5

---

## 7. Sprint Plan

Total estimated stories: ~130 story points across 10 epics.
Sprint velocity (target): 20–25 points per sprint.
Planned sprints: 6 sprints = 12 weeks.

---

### Sprint 0 — Setup (Week 1–2)

**Goal:** The team can run the app locally and deploy to the server. No features yet.

| Story | Points |
|---|---|
| US-001 Project scaffold | 3 |
| US-002 Database schema | 3 |
| US-003 CI/CD pipeline | 5 |
| US-004 Environment & hosting | 5 |

**Sprint total:** 16 points
**Deliverable:** App runs at `hub.courslumiere.com` (login page only).

---

### Sprint 1 — Auth & Shell (Week 3–4)

**Goal:** Users can log in, see their role-appropriate home screen, and the navigation shell works.

| Story | Points |
|---|---|
| US-005 Email/password login | 3 |
| US-006 Google OAuth login | 5 |
| US-007 User roles | 3 |
| US-008 Password reset | 2 |
| US-031 PWA manifest | 3 |
| US-033 App icon and splash screen | 2 |

**Sprint total:** 18 points
**Deliverable:** Staff can log in with Google, see the home screen, and install the app on their phone.

---

### Sprint 2 — Platform Tiles (Week 5–6)

**Goal:** The full platform tiles experience is working, including admin management.

| Story | Points |
|---|---|
| US-010 Home screen with platform tiles | 5 |
| US-011 Tiles by category | 3 |
| US-012 Admin manages tiles | 5 |
| US-013 Role-based tile visibility | 3 |
| US-015 Tile search | 2 |
| US-034 Admin dashboard | 3 |

**Sprint total:** 21 points
**Deliverable:** Admin can add/edit platform tiles. All users see the correct tiles for their role. One-tap access to any school platform.

---

### Sprint 3 — Announcements (Week 7–8)

**Goal:** The announcements board is fully functional for both admins and users.

| Story | Points |
|---|---|
| US-016 Announcements feed | 5 |
| US-017 Admin posts announcement | 5 |
| US-018 Tags and filtering | 3 |
| US-019 Mark as read | 3 |
| US-020 Edit/delete announcement | 2 |
| US-022 Audience-targeted announcements | 3 |
| US-035 User management | 8 |

**Sprint total:** 29 points *(stretch: split US-035 across sprints if needed)*
**Deliverable:** Admins can post targeted announcements. All users can read, filter, and track what they've seen.

---

### Sprint 4 — Notifications & Inbox (Week 9–10)

**Goal:** Push notifications are live and the inbox shows Gmail and Calendar.

| Story | Points |
|---|---|
| US-027 Request push permission | 3 |
| US-028 Push on new announcement | 8 |
| US-029 Urgent-only opt-in | 3 |
| US-023 Connect Google account | 5 |
| US-024 Gmail preview | 5 |
| US-025 Google Calendar | 5 |

**Sprint total:** 29 points *(stretch: split Gmail/Calendar if needed)*
**Deliverable:** Users receive push notifications. Staff connected to Google see Gmail and Calendar in the inbox.

---

### Sprint 5 — Offline, Preferences & Admin (Week 11–12)

**Goal:** The PWA works offline. Users control their notifications. Admin panel is complete.

| Story | Points |
|---|---|
| US-032 Service worker & offline | 5 |
| US-014 User pins favourite tiles | 3 |
| US-026 Unified inbox view | 3 |
| US-036 Announcement management | 3 |
| US-037 Tile management (drag-drop) | 5 |
| US-038 Notification broadcast | 5 |
| US-039 Notification preferences | 3 |
| US-009 Onboarding screen | 3 |

**Sprint total:** 30 points *(stretch: deprioritise US-014 if needed)*
**Deliverable:** Full admin panel working. App works offline. Users can customise notifications.

---

### Sprint 6 — Polish & Launch (Week 13–14)

**Goal:** The app is production-ready and the school can start using it.

| Story | Points |
|---|---|
| US-041 Mobile responsiveness audit | 5 |
| US-042 Performance optimisation | 5 |
| US-030 iOS web push | 5 |
| US-040 Quiet hours | 5 |
| US-021 Announcement search | 3 |
| US-043 User guide (French) | 3 |
| US-044 Admin guide | 2 |
| US-045 Production smoke test & launch | 5 |

**Sprint total:** 33 points *(deprioritise US-040 if over capacity)*
**Deliverable:** App launched to all school users. Guides distributed. Push notifications working on iPhone and Android.

---

## 8. Technical Conventions

### Branching strategy

```
main          ← production, protected
develop       ← integration branch
feature/US-XXX-short-description   ← one branch per story
fix/US-XXX-short-description       ← bug fix branches
```

Rules:
- Never commit directly to `main` or `develop`
- Open a pull request to merge into `develop`
- `develop` merges into `main` at end of sprint after review

### Commit message format

```
[US-XXX] Short description of what was done

- More detail if needed
- Keep first line under 72 characters
```

### Laravel conventions

- Controllers stay thin — business logic goes in Service classes
- Use Form Requests for all validation
- Use Laravel Policies for authorisation (not inline `if` checks)
- Database queries go in Repository or Eloquent Model scopes
- All sensitive config values in `.env`, never hardcoded
- Use `php artisan make:` commands for all new files

### React / Inertia conventions

- One component per file
- Component files: `PascalCase.jsx`
- Utility files: `camelCase.js`
- All pages in `resources/js/Pages/`
- Shared components in `resources/js/Components/`
- Use Inertia `useForm` for all forms
- No inline styles — Tailwind classes only

### API / data flow

```
React component
  → Inertia visit (form submit or link)
  → Laravel Route
  → Laravel Controller
  → Service class
  → Eloquent Model / DB
  → Inertia::render() with props back to React
```

### Testing

- Feature tests for all API endpoints (`php artisan test`)
- At minimum: happy path + one failure case per endpoint
- Frontend: manual test checklist per story (no automated frontend tests required in v1)
- Test database separate from development database

### Environment variables required

```env
APP_NAME="Cours Lumière Hub"
APP_URL=https://hub.courslumiere.com

DB_CONNECTION=mysql
DB_DATABASE=courslumiere
DB_USERNAME=
DB_PASSWORD=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=

VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
VAPID_SUBJECT=mailto:admin@courslumiere.com

MAIL_MAILER=smtp
MAIL_HOST=
MAIL_PORT=
MAIL_USERNAME=
MAIL_PASSWORD=
MAIL_FROM_ADDRESS=noreply@courslumiere.com
```

---

## 9. Non-Functional Requirements

| Category | Requirement |
|---|---|
| **Performance** | Page load under 2s on 4G. Lighthouse score ≥ 80 on mobile. |
| **Security** | HTTPS enforced. All user data encrypted at rest. OAuth tokens encrypted in DB. CSRF protection on all forms. Rate limiting on login (5 attempts before lockout). |
| **Availability** | 99% uptime target. Automated daily database backups retained for 30 days. |
| **Scalability** | Must support up to 500 concurrent users without degradation. |
| **Accessibility** | All interactive elements keyboard-accessible. Minimum contrast ratio 4.5:1. |
| **Language** | Default UI language: French. English as secondary (toggle in settings — v2). |
| **Privacy** | Gmail and Calendar data never stored permanently. Only previews fetched in real-time. GDPR-compliant data handling. |
| **Browser support** | Chrome 90+, Safari 14+, Firefox 90+, Edge 90+. |

---

## 10. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| iOS push notifications not working on older iPhones | High | Medium | Document iOS 16.4+ requirement. Provide email fallback for critical updates. |
| Google OAuth tokens expiring silently | Medium | High | Implement token refresh in Laravel Socialite. Show "reconnect" prompt in inbox if token invalid. |
| WhatsApp API unavailable for message aggregation | Certain | Low | Scope is deep-link only (not API). Document this clearly. Users tap to open WhatsApp directly. |
| Admin posts to wrong audience | Medium | Medium | Show audience confirmation dialog before publish. Allow edit after post. |
| School changes hosting provider | Low | Medium | App uses standard Laravel — runs on any PHP 8.2+ host. Migrations portable. |
| Non-technical admin struggles with panel | Medium | High | Write French admin guide (US-044). Train one admin in person at launch. |
| Developer leaves mid-project | Low | High | All code on Git. README with full setup instructions. Code review enforced so knowledge is shared. |
| VAPID keys lost (breaks push notifications) | Low | High | Store VAPID keys in password manager AND `.env` backup. Document regeneration process. |

---

*Document maintained by the Scrum Master. Updated at the start of each sprint.*

