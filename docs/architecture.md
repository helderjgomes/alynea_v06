# Architecture

## Overview

Alynea is intentionally simple in architecture.
The system prioritizes readability, explicitness, and low cognitive overhead over scalability or abstraction.

The app is currently designed as a single-user system.

## Stack (High Level)

- Frontend: React-based UI (web, macOS-first mindset)
- Styling: Custom styling aligned with Apple HIG principles
- Backend: Supabase
- Database: Supabase Postgres
- Auth: Intentionally absent (single-user mode)

## Architectural Boundaries

### UI Layer
- Responsible for rendering, interaction, and layout
- Keeps logic shallow and explicit
- Avoids complex state machines

### Data Layer
- Supabase is the source of truth
- Queries and mutations are explicit and localized
- No hidden data transformations

### Domain Logic
- Minimal
- Lives close to usage
- Avoids generic abstraction layers

## Folder Structure (Conceptual)

- `/app` or `/src`
  - UI views and screens
  - Components
- `/docs`
  - Product and technical documentation
- `/lib`
  - Supabase client
  - Shared utilities

## Conventions

- Prefer explicit over clever
- Prefer composition over inheritance
- Prefer readable duplication over premature abstraction
- Side effects should be visible and traceable

## Decisions and Ownership

- Product decisions live in `docs/product-vision.md`
- Architectural decisions live in this file
- UI rules live in `docs/component-guide.md`
- API usage rules live in `docs/api-patterns.md`

## Intentional Gaps

The following are intentionally missing:
- Authentication
- Multi-user support
- Permissions and roles
- Offline-first logic

These will only be added when they serve the product vision, not preemptively.
