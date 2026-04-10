# LumaHub — Multi-Tenant SaaS Agile Scrum Plan

**Product:** LumaHub
**Category:** White-label multi-tenant SaaS hub
**Stack:** Laravel + Inertia.js + React + Tailwind CSS + MySQL / PostgreSQL
**Hosting model:** Cloud-hosted SaaS with tenant-aware routing
**Version:** 2.0
**Last updated:** April 2026

---

## Table of Contents

1. [Product Overview](#1-product-overview)
2. [Product Principles](#2-product-principles)
3. [Primary Users and Roles](#3-primary-users-and-roles)
4. [Scrum Operating Model](#4-scrum-operating-model)
5. [Definition of Ready and Done](#5-definition-of-ready-and-done)
6. [Epics](#6-epics)
7. [Backlog — Core User Stories](#7-backlog--core-user-stories)
8. [Sprint Plan](#8-sprint-plan)
9. [Technical Conventions](#9-technical-conventions)
10. [Non-Functional Requirements](#10-non-functional-requirements)
11. [Risks and Mitigations](#11-risks-and-mitigations)

---

## 1. Product Overview

### Problem
Most organisations rely on many disconnected tools for communication, operations, HR, finance, documents, calendars, support, and internal workflows. Users waste time switching between systems, miss critical updates, and often do not know which app is the right one for a task.

### Solution
LumaHub is a branded SaaS hub that gives each organisation one secure, configurable entry point to its digital tools.

Each tenant gets:
- a branded home experience
- a role-aware app catalog
- announcements and notifications
- optional unified inbox and activity feeds
- organisation admin controls
- an installable PWA-like experience across devices

### Product promise
**One branded hub for every organisation, many apps behind it, one consistent user experience.**

### Business model assumption
A single shared platform serves many tenants, while each tenant experiences the product as its own branded portal.

### Success metrics
- 70% of newly created tenants complete initial setup within 7 days
- 80% of tenant admins publish their first app catalog within 48 hours of onboarding
- Median time for an end user to reach a target app is under 10 seconds
- 60% of active tenants publish at least one announcement in the first month
- 50% of end users return weekly within the first 30 days

---

## 2. Product Principles

1. **Tenant-first:** Every feature must respect organisation boundaries and tenant data isolation.
2. **White-label by configuration:** Branding should be driven by settings, not custom forks.
3. **Mobile-first:** The hub should feel fast and intuitive on phones before expanding to desktop complexity.
4. **Admin self-serve:** Tenant admins should be able to launch and manage their hub without developer help.
5. **Composable integrations:** The hub should connect to many apps without trying to replace all of them.
6. **Sector-flexible:** Education can be a strong first vertical, but the platform must work for any organisation type.

---

## 3. Primary Users and Roles

### Platform roles

| Role | Responsibility |
|---|---|
| Platform Owner | Owns roadmap, pricing, compliance, and strategic priorities |
| Platform Operations Admin | Supports tenant provisioning, health monitoring, and escalations |
| Support / Success | Onboards tenants and helps admins configure the hub |

### Tenant roles

| Role | Responsibility |
|---|---|
| Organisation Owner | Owns tenant account and subscription |
| Organisation Admin | Manages branding, apps, members, and announcements |
| Communications Admin | Publishes updates and broadcasts |
| Manager | Oversees a team, department, or workspace |
| Member | Uses the hub, apps, and updates |
| Guest | Limited access to selected apps or information |

### Audience model
Audience labels must be configurable per tenant. Examples:
- staff
- students
- parents
- members
- volunteers
- departments
- regional offices
- franchise branches
- partners
- clients

---

## 4. Scrum Operating Model

### Sprint length
**2 weeks** per sprint.

### Core ceremonies

| Ceremony | When | Duration | Participants |
|---|---|---|---|
| Sprint Planning | Start of sprint | 2 hours | Product + engineering + QA |
| Daily Standup | Weekdays | 15 min | Delivery team |
| Backlog Refinement | Mid-sprint | 60 min | Product + tech leads |
| Sprint Review | End of sprint | 60 min | Delivery team + stakeholders |
| Retrospective | End of sprint | 45 min | Delivery team |

### Delivery approach
- prioritise tenant-safe platform capabilities before advanced integrations
- release small increments behind feature flags when useful
- validate flows using at least one internal demo tenant and one realistic sample tenant configuration

---

## 5. Definition of Ready and Done

### Definition of Ready
A story can enter a sprint only when:
- [ ] problem and user value are clear
- [ ] tenant scope is explicit
- [ ] acceptance criteria are testable
- [ ] design or UX reference exists where needed
- [ ] dependencies and migration impact are understood
- [ ] data isolation and permission implications were considered

### Definition of Done
A story is done only when:
- [ ] code is implemented and reviewed
- [ ] acceptance criteria are met
- [ ] tenant boundaries are enforced
- [ ] tests are added or updated and passing
- [ ] mobile and desktop flows are checked
- [ ] no critical console or server errors remain
- [ ] feature is documented if it affects admin workflows or platform operations

---

## 6. Epics

| # | Epic | Description |
|---|---|---|
| E1 | Platform foundation | Core repo, environments, CI/CD, base architecture |
| E2 | Multi-tenancy | Organisation scoping, tenant resolution, data isolation |
| E3 | Branding and white-label | Theme tokens, logos, app naming, tenant shell branding |
| E4 | Authentication and membership | Login, invites, onboarding, role-aware access |
| E5 | Hub home and app catalog | Home experience, categories, favourites, app launch |
| E6 | Announcements and activity | Organisation updates, targeting, read state, search |
| E7 | Notifications | Web push, preferences, broadcasts, urgent rules |
| E8 | Integrations and unified inbox | Connected tools, previews, activity summaries |
| E9 | Tenant admin console | Branding, app management, user management, analytics |
| E10 | Platform operations | Super admin tooling, tenant lifecycle, support actions |
| E11 | Quality, launch, and growth | Performance, accessibility, onboarding, adoption |

---

## 7. Backlog — Core User Stories

Story scale: 1 = trivial, 2 = small, 3 = medium, 5 = large, 8 = very large

### Epic E1 — Platform foundation

**US-001 — Base product scaffold**
As a developer, I want a stable Laravel + Inertia + React foundation so the platform has a consistent technical base.

**Acceptance criteria:**
- project runs locally with documented setup
- CI validates formatting, types, and tests
- environments support local, staging, and production
- shared layout and auth shell render successfully

**Points:** 3

**US-002 — Core schema baseline**
As a developer, I want the core tables and relationships defined so tenant features have a reliable foundation.

**Acceptance criteria:**
- schema supports organisations, memberships, users, apps, announcements, notification preferences
- migrations run cleanly
- seeders provide a demo tenant and sample users

**Points:** 5

### Epic E2 — Multi-tenancy

**US-003 — Tenant-aware routing**
As the platform, I want routes to resolve the current organisation so all user actions happen in the correct tenant context.

**Acceptance criteria:**
- organisation context resolved by slug and designed for future subdomain support
- non-members cannot access tenant routes
- current tenant available to frontend shared data
- tests cover valid, missing, and unauthorized tenant access

**Points:** 5

**US-004 — Tenant data isolation**
As a platform owner, I want tenant data isolated so one organisation can never access another organisation’s records.

**Acceptance criteria:**
- organisation-scoped queries exist for key models
- policies and middleware enforce access rules
- test coverage proves cross-tenant isolation
- audit notes identify any models intentionally global

**Points:** 8

**US-005 — Tenant provisioning flow**
As a platform operations admin, I want to create a new organisation quickly so onboarding is repeatable.

**Acceptance criteria:**
- create organisation with name, slug, owner email, locale, and sector template
- owner receives invite or activation link
- default roles and categories are provisioned
- onboarding status is tracked

**Points:** 5

### Epic E3 — Branding and white-label

**US-006 — Brand pack configuration**
As an organisation admin, I want to upload my brand assets so the hub reflects my organisation identity.

**Acceptance criteria:**
- admin can set organisation name, logo, icon, primary colour, accent colour
- branding updates appear in tenant shell
- contrast validation prevents inaccessible combinations
- brand pack is stored per tenant

**Points:** 5

**US-007 — Dynamic app name and shell branding**
As an end user, I want the tenant’s branded shell to feel like my organisation’s portal.

**Acceptance criteria:**
- page title, navigation, and header use tenant branding where appropriate
- fallback platform name remains LumaHub
- brand resolution is configuration-driven
- shell works when tenant branding is incomplete

**Points:** 3

**US-008 — Custom domain readiness**
As a platform owner, I want the system designed for branded domains so premium tenants can use their own URLs.

**Acceptance criteria:**
- domain model and verification workflow are documented or scaffolded
- tenant resolution strategy supports path, subdomain, and custom domain evolution
- no hardcoded customer domains remain in user-facing docs

**Points:** 3

### Epic E4 — Authentication and membership

**US-009 — Email and password login**
As a user, I want to sign in securely so I can access my organisation hub.

**Acceptance criteria:**
- login works with clear failure messaging
- session persistence is configurable
- logout is available from profile/settings
- post-login redirect lands inside the active organisation context

**Points:** 3

**US-010 — Tenant user invitation**
As an organisation admin, I want to invite members so they can join my hub with the right level of access.

**Acceptance criteria:**
- invite by email with expiry
- assign tenant role on invite
- invite acceptance links to organisation context
- duplicate and invalid invites are blocked

**Points:** 5

**US-011 — Configurable tenant roles**
As an organisation admin, I want roles and visibility rules so users only see what is relevant.

**Acceptance criteria:**
- core roles exist: owner, admin, manager, member, guest
- tenant-specific audience tags can coexist with roles
- protected routes and UI obey permissions
- pending users see a clear access state

**Points:** 5

**US-012 — First-run onboarding**
As a new user, I want a short onboarding flow so I understand the hub’s value immediately.

**Acceptance criteria:**
- shown only on first successful sign-in
- messaging is tenant-aware and generic enough for many sectors
- includes app discovery and notifications setup prompts
- completion status stored per user

**Points:** 3

### Epic E5 — Hub home and app catalog

**US-013 — Branded hub home**
As a user, I want a clear home dashboard so I can quickly access the most important tools and updates.

**Acceptance criteria:**
- home shows branded header, quick stats, pinned apps, and recent updates
- shell works on mobile and desktop
- empty states guide first-time tenants

**Points:** 5

**US-014 — App catalog**
As a user, I want to browse all organisation-approved apps so I can launch the right tool quickly.

**Acceptance criteria:**
- apps display as searchable tiles or cards
- categories are configurable per tenant
- each app includes icon, name, destination, and visibility rules
- links support internal routes or external destinations

**Points:** 5

**US-015 — Role and audience-based app visibility**
As an organisation admin, I want app visibility controls so different user segments see different tools.

**Acceptance criteria:**
- apps can be assigned to roles and/or audience groups
- admins can preview visibility behavior
- users only see assigned apps

**Points:** 3

**US-016 — Favourite and recent apps**
As a user, I want favourite and recent apps surfaced so repeated tasks become faster.

**Acceptance criteria:**
- users can pin favourites
- recently launched apps are tracked per user
- favourite state persists across devices

**Points:** 3

### Epic E6 — Announcements and activity

**US-017 — Tenant announcement feed**
As a user, I want a feed of organisation updates so I can stay informed without checking many tools.

**Acceptance criteria:**
- updates feed is available inside the hub
- announcement cards show title, author, time, tag, and preview
- ordering is newest first
- feed is paginated or incrementally loaded

**Points:** 5

**US-018 — Targeted announcement publishing**
As a communications admin, I want to publish targeted updates so only relevant audiences receive them.

**Acceptance criteria:**
- audience selection supports all users, roles, and configured segments
- previews are available before publish
- draft and published states are supported
- publish event can trigger notification workflows

**Points:** 5

**US-019 — Read tracking and unread counts**
As a user, I want unread indicators so I know what I have not seen yet.

**Acceptance criteria:**
- unread state stored per user
- badges appear on updates navigation
- mark-one and mark-all-as-read flows exist

**Points:** 3

**US-020 — Update search and filters**
As a user, I want to filter and search updates so I can find important past communications.

**Acceptance criteria:**
- filter by tag and audience when appropriate
- search covers title and body
- empty states are clear

**Points:** 3

### Epic E7 — Notifications

**US-021 — Notification permission flow**
As a user, I want notification prompts at the right time so I understand why alerts matter.

**Acceptance criteria:**
- request is not shown before value is clear
- explanatory copy is tenant-neutral
- permission state is tracked
- settings allow later opt-in/out

**Points:** 3

**US-022 — Announcement push notifications**
As a user, I want to receive timely push notifications so I do not miss important updates.

**Acceptance criteria:**
- push fires shortly after publish
- notifications respect target audience and user preferences
- tapping notification lands in the relevant update

**Points:** 5

**US-023 — Notification preferences**
As a user, I want fine-grained control over alerts so I receive only what matters.

**Acceptance criteria:**
- preferences support all, urgent-only, selected categories, none
- quiet hours can be added later without redesigning the data model
- settings persist in database

**Points:** 3

### Epic E8 — Integrations and unified inbox

**US-024 — Connected account framework**
As the platform, I want a reusable integration foundation so multiple providers can plug into the hub safely.

**Acceptance criteria:**
- integration credentials are stored securely
- provider status and reconnect flows exist
- tenant-level and user-level integrations can be distinguished

**Points:** 8

**US-025 — Unified activity surface**
As a user, I want one place for connected alerts and events so I can triage work quickly.

**Acceptance criteria:**
- inbox can show activity from multiple sources
- each item is clearly labeled by source
- empty states explain how to connect tools

**Points:** 5

### Epic E9 — Tenant admin console

**US-026 — Branding management screen**
As an organisation admin, I want to manage branding myself so the hub always matches my organisation identity.

**Acceptance criteria:**
- branding form includes preview
- invalid colour combinations are blocked or warned
- updates apply without code changes

**Points:** 3

**US-027 — App management screen**
As an organisation admin, I want to create and maintain my app catalog so the hub reflects real usage.

**Acceptance criteria:**
- CRUD for apps and categories
- drag-and-drop or sortable priority list
- role and audience visibility controls included
- URL validation on save

**Points:** 5

**US-028 — Member management**
As an organisation admin, I want to manage members so access stays accurate over time.

**Acceptance criteria:**
- search, filter, invite, role changes, deactivation
- audit entries for critical admin actions
- deactivated members cannot access tenant routes

**Points:** 5

**US-029 — Tenant analytics overview**
As an organisation admin, I want usage insight so I understand whether the hub is working.

**Acceptance criteria:**
- dashboard shows member count, active members, app launches, announcement engagement
- analytics are tenant-scoped only
- empty data states are meaningful for new tenants

**Points:** 3

### Epic E10 — Platform operations

**US-030 — Platform super-admin tenant list**
As a platform operations admin, I want to see all tenants so I can support onboarding and health checks.

**Acceptance criteria:**
- searchable tenant directory exists
- onboarding state, owner, plan, and status are visible
- actions are audited

**Points:** 5

**US-031 — Tenant lifecycle controls**
As a platform operations admin, I want to suspend or reactivate tenants so platform governance is manageable.

**Acceptance criteria:**
- tenant status supports active, trial, suspended, archived
- suspended tenants cannot sign in normally
- reactivation restores access safely

**Points:** 3

### Epic E11 — Quality, launch, and growth

**US-032 — Performance and responsiveness audit**
As a user, I want the hub to feel fast so it becomes the default place I start my work.

**Acceptance criteria:**
- mobile performance targets are documented and measured
- no horizontal scrolling on supported breakpoints
- important interactions are thumb-friendly on mobile

**Points:** 5

**US-033 — Tenant onboarding guide**
As a new organisation admin, I want a short setup guide so I can launch my branded hub confidently.

**Acceptance criteria:**
- guide covers tenant setup, branding, apps, announcements, invites
- written in plain language
- linked from admin console

**Points:** 2

**US-034 — Production readiness check**
As the delivery team, we want a verified release process so new tenants can be onboarded safely.

**Acceptance criteria:**
- smoke tests cover sign-in, tenant context, app launch, updates, invites
- backup and rollback steps are documented
- staging demo tenant exists for release verification

**Points:** 5

---

## 8. Sprint Plan

Estimated MVP scope: **~150 story points**
Target velocity: **20–24 points per sprint**
Target MVP timeline: **7 sprints / 14 weeks**

### Sprint 0 — Foundation and architecture
**Goal:** project runs locally and key architecture decisions are locked.
- US-001 Base product scaffold
- US-002 Core schema baseline
- US-003 Tenant-aware routing

### Sprint 1 — Tenant core
**Goal:** organisation context and isolation are working end to end.
- US-004 Tenant data isolation
- US-005 Tenant provisioning flow
- US-009 Email and password login

### Sprint 2 — Branding and identity
**Goal:** each tenant can feel like its own branded product.
- US-006 Brand pack configuration
- US-007 Dynamic app name and shell branding
- US-012 First-run onboarding
- US-026 Branding management screen

### Sprint 3 — App catalog MVP
**Goal:** users can reach the right tools quickly.
- US-013 Branded hub home
- US-014 App catalog
- US-015 Role and audience-based app visibility
- US-016 Favourite and recent apps

### Sprint 4 — Communications MVP
**Goal:** tenant updates and unread tracking work.
- US-017 Tenant announcement feed
- US-018 Targeted announcement publishing
- US-019 Read tracking and unread counts
- US-020 Update search and filters

### Sprint 5 — Notifications and members
**Goal:** admin operations and alerts are functional.
- US-010 Tenant user invitation
- US-011 Configurable tenant roles
- US-021 Notification permission flow
- US-022 Announcement push notifications
- US-023 Notification preferences
- US-028 Member management

### Sprint 6 — Admin analytics and platform ops
**Goal:** tenant admin and platform operations have visibility.
- US-027 App management screen
- US-029 Tenant analytics overview
- US-030 Platform super-admin tenant list
- US-031 Tenant lifecycle controls

### Sprint 7 — Quality and launch
**Goal:** the MVP is production-ready for early tenants.
- US-024 Connected account framework
- US-025 Unified activity surface
- US-032 Performance and responsiveness audit
- US-033 Tenant onboarding guide
- US-034 Production readiness check

---

## 9. Technical Conventions

### Naming and terminology
- Public product name: `LumaHub`
- Customer entity: `organisation`
- Technical tenancy concept: `tenant`
- Internal existing implementation may still use `Team` temporarily while product language uses organisation/tenant

### Branching strategy

```text
main
develop
feature/US-XXX-short-description
fix/US-XXX-short-description
```

### Backend conventions
- controllers stay thin
- validation lives in Form Requests
- authorisation uses policies and middleware
- tenant scoping must be explicit in queries and services
- no customer-specific branching in code for branding

### Frontend conventions
- reusable shell components should consume theme tokens
- no hardcoded tenant names in components
- tenant branding should degrade gracefully to platform defaults
- layout components should separate platform chrome from tenant content

### Example environment variables

```env
APP_NAME="LumaHub"
APP_URL=https://app.lumahub.com

TENANCY_MODE=path
PLATFORM_DOMAIN=lumahub.com

DB_CONNECTION=mysql
DB_DATABASE=lumahub
DB_USERNAME=
DB_PASSWORD=

MAIL_FROM_ADDRESS=noreply@lumahub.com
MAIL_FROM_NAME="${APP_NAME}"
```

### Testing expectations
- feature tests for tenant routing, membership, and authorisation
- tests covering cross-tenant access denial
- tests for branding fallback behavior where practical
- release smoke tests using at least one demo tenant

---

## 10. Non-Functional Requirements

| Category | Requirement |
|---|---|
| Performance | Home and app catalog should feel responsive on mid-range mobile devices; optimise for sub-2s meaningful load on common 4G conditions where practical. |
| Security | HTTPS only, encrypted secrets, CSRF protection, rate limiting, secure invite flows, and encrypted integration tokens. |
| Tenant isolation | No tenant can access another tenant’s members, apps, announcements, analytics, or assets. |
| Availability | Target 99.5% uptime for shared platform services. |
| Scalability | Architecture should support growth from pilot tenants to many concurrent organisations. |
| Accessibility | Keyboard-accessible interactions, sufficient colour contrast, and accessible branding constraints. |
| Branding safety | Tenant theming must not break legibility or shell usability. |
| Privacy | Tenant data handled according to least-privilege principles and applicable privacy regulations. |
| Auditability | Critical admin and platform operations actions must be traceable. |

---

## 11. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Tenant data leakage due to missed scoping | Medium | Critical | enforce policies, scoped queries, and dedicated cross-tenant tests |
| Branding flexibility causes inconsistent UX | Medium | High | limit branding to tokens and approved assets |
| Onboarding too complex for non-technical admins | High | High | guided setup, templates, and a short admin guide |
| Too much sector-specific language leaks into product | Medium | Medium | maintain neutral terminology and sector templates |
| Integration work expands scope too early | High | Medium | keep MVP useful without deep integrations |
| Custom domains add operational complexity | Medium | Medium | launch with path-based tenancy first, design for domain evolution |
| Platform ops tooling lags behind tenant growth | Medium | High | include super-admin views before broader rollout |

---

*This document is the active Scrum plan for the multi-tenant LumaHub product direction.*

