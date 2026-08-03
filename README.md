# SiteFlow Operations

I want you to act as a Senior Product Designer (Figma level) specialized in enterprise SaaS applications.

IMPORTANT:

This is NOT a new application.

This project already works and is connected to Supabase.

DO NOT rewrite the business logic.

DO NOT change database models.

DO NOT remove existing functionality.

Your task is ONLY to redesign and improve the UI/UX while preserving all existing functionality.

The application is called:

SiteFlow

Module: Housing

It will later become one module inside a larger Operations Platform containing:

• Housing

• Site Activities

• HR

• Assets / Tools

• Fleet

Therefore the design must be scalable for future modules.

------------------------------------------------

Design goals

I want the application to look like a premium enterprise product.

Examples of quality level:

Linear

Notion

Monday.com

Asana

ClickUp

Stripe Dashboard

Supabase Dashboard

NOT a generic admin template.

------------------------------------------------

General requirements

• Modern enterprise UI

• Extremely clean

• Fast to understand

• Excellent information hierarchy

• Minimal visual noise

• Large work area

• Responsive

• Dark mode and Light mode

• Smooth transitions (150–200ms)

• Beautiful hover effects

• Keyboard friendly

------------------------------------------------

Dashboard

Every module must have its OWN dashboard.

Housing Dashboard must contain:

• KPI cards

• Occupancy graph

• Occupancy %

• Free beds

• Occupied rooms

• Upcoming arrivals

• Upcoming departures

• Monthly costs

• Active locations

Interactive charts with smooth hover.

Cards should be smaller.

Numbers larger.

Labels cleaner.

------------------------------------------------

Planner

Planner is the heart of the application.

Improve:

• Timeline readability

• Occupancy bars

• Drag & Drop

• Better spacing

• Better colors

• Better expired indicators

• Better hover

• Better zoom controls

• Better scrolling

• Sticky headers

• Sticky room names

Planner must feel like a professional scheduling software.

------------------------------------------------

Navigation

The sidebar should feel modern.

Features:

Resizable width

Collapse

Smooth animations

Better section hierarchy

Better icons

Each module has:

Dashboard

Pages

Configuration

Reports

Settings

------------------------------------------------

Pages

Convert every popup into a real page.

Especially:

History

Reports

Costs & Billing

Alerts

Unassigned people

Each page should include:

KPIs

Filters

Advanced search

Sorting

Bulk actions

Tables

Pagination

Export

Print

------------------------------------------------

History page

Needs to look like an ERP.

Include:

Status colors

Costs

Rates

Company

Construction site

Location

Room

Date range

Duration

Actions

Timeline

------------------------------------------------

Costs & Billing

Needs a premium financial dashboard.

Include:

Revenue

Costs

Occupancy

Cost by location

Cost by room

Cost by construction site

Monthly evolution

Pie charts

Bar charts

Trend charts

------------------------------------------------

Reports

Professional reporting center.

Filters:

Construction site

Location

Room

Employee

Company

Date

Status

Export:

Excel

PDF

CSV

------------------------------------------------

Alerts

NOT popup.

Dedicated page.

Grouped by severity.

Critical

Warning

Information

Actions

Resolve

Ignore

Assign

------------------------------------------------

Visual design

Reduce white space.

Increase information density without feeling crowded.

Use better typography.

Better icons.

Better hover states.

Better empty states.

Professional shadows.

Rounded corners.

Consistent spacing.

------------------------------------------------

Animation

Use subtle animations only.

No flashy effects.

Everything should feel premium.

------------------------------------------------

Most important requirement

DO NOT redesign only individual components.

Think like you are designing a complete enterprise operating system.

Everything must feel coherent across every page.

------------------------------------------------

At the end provide:

1. Overall UX review

2. Weaknesses of the current design

3. Improvement roadmap

4. New component hierarchy

5. Complete redesigned UI

6. Ready-to-use implementation inside the current project.

Do NOT simplify the application.

Upgrade it to enterprise level.
Do not replace my current architecture. Improve the existing project in-place and preserve compatibility with Supabase.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/4a501fd4-3d87-40d9-b3c5-d00bc82a957d).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
