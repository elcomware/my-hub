# LumaHub — SaaS Hub Product Vision

_Last updated: April 2026_

## 1. Product Reframing

The original concept in `docs/legacy/legacy-school-scrum-plan.md` was written for a single school.

The active delivery plan for the product is now `docs/lumahub-saas-scrum-plan.md`.

The new direction is broader:

**LumaHub is a multi-tenant, white-label SaaS platform that any organisation can use as a central hub for its people, tools, messages, and workflows — all under that organisation’s own brand.**

In practice, that means:
- one shared product platform
- many organisations using it independently
- each organisation seeing its own logo, colours, language choices, app catalog, announcements, and user roles
- a consistent platform shell with tenant-specific branding and configuration

---

## 2. Core Vision

### Problem
Organisations often rely on many disconnected tools: communication platforms, HR systems, calendars, intranets, file storage, learning tools, CRMs, ticketing systems, and internal apps. Users waste time switching between systems, miss important updates, and struggle to know where to go.

### Solution
A branded digital hub that gives each organisation:
- a single place to access all its apps
- a unified updates and notification layer
- optional inbox and activity aggregation from connected systems
- organisation-specific navigation, permissions, and content
- an installable web app experience that feels like the organisation’s own product

### Product Promise
**One hub, many apps, fully branded per organisation.**

---

## 3. Positioning

### What it is
A SaaS hub platform for organisations with multiple tools and audiences.

### What it is not
- not a custom one-off portal for a single school
- not limited to education
- not a replacement for every connected system
- not a marketplace of public apps

### Best-fit customers
The platform can serve:
- schools and education groups
- NGOs and associations
- SMEs and multi-site businesses
- franchises and networks
- consulting firms
- community organisations
- faith-based organisations
- internal enterprise departments needing a branded portal

---

## 4. Tenant Model

### Primary concept: organisation = tenant
Each customer organisation is a tenant in the platform.

Each tenant has:
- organisation profile
- brand settings
- custom navigation
- app directory
- audience structure
- announcements and notifications
- users, roles, and permissions
- optional custom domain

### Suggested terminology
To avoid confusion in product and engineering discussions:

| Concept | Meaning |
|---|---|
| **Platform** | The shared SaaS product operated by us |
| **Organisation** | A customer account using the platform |
| **Tenant** | The technical representation of an organisation |
| **Hub** | The branded experience an organisation’s users log into |
| **App** | A linked internal or external tool shown inside the hub |
| **Workspace** | Optional subdivision inside an organisation |
| **User** | A person belonging to one or more organisations/workspaces |

### Mapping to current codebase
The existing `Team` model and team-based routing already align well with the tenant concept.

Current likely mapping:
- `Team` -> organisation / tenant
- team membership -> organisation membership
- team roles -> tenant roles
- team slug route -> branded tenant URL path or subdomain resolver

---

## 5. White-Label Branding Principles

Each organisation should be able to make the hub feel like its own.

### Brandable elements
- logo
- organisation name
- primary / secondary colours
- typography choices or approved font set
- iconography style
- splash screen and PWA metadata
- email templates
- notification sender name
- login page imagery and messaging
- custom domain or branded subdomain

### Branding boundaries
To preserve platform quality and maintainability:
- layout structure stays product-controlled
- accessibility rules remain enforced
- component behavior remains consistent across tenants
- theming is configuration-driven, not custom-coded per tenant

---

## 6. Core Product Capabilities

### A. Hub Home
The organisation’s landing experience should provide:
- branded header and welcome area
- quick stats or activity highlights
- pinned apps
- recent updates
- shortcuts into core organisation workflows

### B. App Directory
Users can access all approved tools from one place:
- categories and collections
- role-based visibility
- deep links to external systems
- internal app launches
- app badges or counters where integrations exist
- favourites and recents

### C. Announcements & Updates
Each tenant needs its own communication layer:
- organisation-wide announcements
- targeted posts by audience, team, or role
- tags such as urgent, event, info, operational
- read tracking
- push notifications and email fallback

### D. Unified Inbox / Activity Stream
Where integrations allow it, the hub can surface:
- email previews
- calendar events
- chat alerts
- workflow notifications
- task reminders
- app-specific activity summaries

### E. Admin Console
Organisation admins need to manage:
- branding
- users and invites
- roles and permissions
- app catalog
- categories
- announcements
- notification policies
- usage analytics

### F. Onboarding & Provisioning
A SaaS-ready product must support:
- tenant creation
- guided setup wizard
- brand setup
- first apps import
- admin invites
- optional template packs by industry

---

## 7. Target User Types

Instead of school-only roles such as teacher, parent, and student, the platform should support configurable audiences.

### Platform-level roles
- platform super admin
- support / operations admin

### Tenant-level roles
- organisation owner
- organisation admin
- manager
- editor / communications admin
- member
- guest

### Audience segmentation examples
Depending on tenant type, audiences may be:
- staff
- students
- parents
- volunteers
- members
- partners
- clients
- departments
- regional offices
- franchise branches

This should be configuration-driven rather than hardcoded.

---

## 8. Experience Principles

The product should feel:
- simple enough for non-technical users
- premium and trustworthy
- branded without becoming fragmented
- fast on mobile first
- equally useful as a launchpad and an information layer

### UX rules
- users should reach a key app in one or two taps
- important organisation updates should always be visible
- the branded shell should be recognisable across devices
- admins should be able to configure the tenant without developer help

---

## 9. SaaS Architecture Implications

The product direction changes several technical assumptions from the original school-only plan.

### Multi-tenancy
The application should support strict tenant isolation for:
- users and memberships
- apps and categories
- announcements
- uploaded brand assets
- notification preferences
- audit logs
- integrations and tokens

### Domain strategy
Support one or more of:
- path-based tenancy, e.g. `/acme/dashboard`
- subdomain-based tenancy, e.g. `acme.hub.example.com`
- custom domain mapping, e.g. `portal.acme.org`

### Brand resolution
The platform shell should resolve brand settings per tenant and inject:
- theme tokens
- logos
- app name
- manifest values
- email template variables

### Configuration over custom development
Tenant differences should mostly come from:
- settings
- roles
- permissions
- templates
- app assignments
- theme tokens

Not from branching the codebase per customer.

---

## 10. MVP Scope for the SaaS Version

A realistic SaaS MVP should focus on the shared platform shell plus tenant self-configuration.

### MVP capabilities
- tenant creation and onboarding
- tenant branding setup
- organisation-scoped authentication
- tenant admin dashboard
- branded home screen
- app directory with categories
- role-based visibility
- announcements and read tracking
- web push notifications
- basic analytics
- tenant-safe user invites

### V2 candidates
- custom domains
- integration marketplace
- SSO / SAML
- per-tenant automation rules
- cross-app search
- usage billing
- tenant templates by sector
- embeddable internal mini-apps

---

## 11. Changes Needed to the Existing School-Specific Plan

The existing scrum plan is still useful as a starting structure, but these assumptions should be updated:

### Replace single-school framing
Change references like:
- school -> organisation
- school admin -> organisation admin
- staff / parents / students -> configurable tenant audiences
- school domain -> tenant domain or platform subdomain
- school branding -> tenant brand pack

### Expand backlog themes
Add or revise stories for:
- tenant provisioning
- tenant branding
- custom domain mapping
- organisation-level settings
- per-tenant roles and permissions
- tenant analytics
- support/admin operations dashboard
- template-based onboarding for different sectors

### Reframe success metrics
Instead of only adoption in one school, track:
- number of active tenant organisations
- tenant activation rate after signup
- branded hub launch time
- app adoption per tenant
- user return rate per tenant
- announcement engagement per tenant
- admin setup completion rate

### Update non-functional requirements
Increase expectations for:
- tenant data isolation
- configuration safety
- scalability across many organisations
- asset storage separation
- auditability for tenant admin actions

---

## 12. Implications for the Current Mockup

The HTML mockup in `docs/lumahub-branded-mockup.html` is a strong direction for a branded mobile shell and now uses neutral, multi-organisation sample content.

It should evolve into a tenant-aware design system with:
- dynamic organisation logo/name
- theme tokens instead of fixed brand colours
- configurable navigation labels
- industry-neutral sample content
- app cards that can represent many kinds of tools
- admin screens for branding and app assignment

In other words, keep the **quality and warmth** of the current mockup, but make the shell reusable for any organisation.

---

## 13. Recommended Next Documentation Updates

1. Refactor the scrum plan so all epics and stories become tenant-aware.
2. Produce a terminology guide for `tenant`, `organisation`, `workspace`, `app`, and `member`.
3. Create a multi-tenant architecture note covering routing, data isolation, and branding resolution.
4. Redesign the mockup using theme variables and generic organisation examples.
5. Define the SaaS MVP separately from sector-specific template packs.

---

## 14. One-Sentence Summary

**We are building a white-label SaaS hub platform where any organisation can launch its own branded portal for accessing multiple apps, publishing updates, and centralising user experience in one place.**

