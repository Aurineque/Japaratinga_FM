<!-- 
Sync Impact Report
Version change: N/A → 1.0.0
Modified principles: N/A (initial constitution)
Added sections: All (initial constitution)
Removed sections: N/A
Templates requiring updates:
  - .specify/templates/plan-template.md ✅ (already includes Constitution Check section)
  - .specify/templates/spec-template.md ✅ (no changes needed)
  - .specify/templates/tasks-template.md ✅ (no changes needed)
  - .specify/templates/checklist-template.md ✅ (no changes needed)
Follow-up TODOs: None
-->

# Japaratinga FM Constitution

## Core Principles

### I. Spec-Driven Development (SDD)
No line of code shall be written without first passing through the Specification
(`/speckit.specify`) and Planning (`/speckit.plan`) phases. Every feature MUST
have an approved specification and implementation plan before any code is
written.

### II. Simplicity & Focus
The primary purpose of the application is to play a live radio stream with the
lowest possible latency and highest possible stability. All features and
decisions MUST serve this core objective; scope creep MUST be rejected.

### III. Resilience
The application MUST gracefully handle connection drops, inform the user of the
connection state, and attempt automatic reconnection. Network interruptions
MUST NOT cause crashes or data loss.

### IV. Mandatory Tech Stack
- **Framework**: React Native via Expo (Managed Workflow)
- **Language**: TypeScript with Strict mode enabled
- **Audio Engine**: `react-native-track-player` (required for background audio
  and lock-screen media controls on Android/iOS)
- **State Management**: zustand (for global player state: Playing, Paused,
  Loading)
- **Styling**: React Native StyleSheet or NativeWind (TailwindCSS for RN)

### V. Architecture & Backend Integration
The application has no traditional backend. It acts as a direct consumer of an
Icecast streaming server. The streaming URL MUST be injected via environment
variables (`.env`). The player MUST treat the URL as a live stream with no
defined duration.

## UI/UX Standards

- **Background Audio**: The app MUST continue playing when minimized or when the
  screen is locked.
- **Native Controls**: The app MUST integrate with OS media controls (iOS
  Control Center, Android notification) showing Play/Pause state.
- **Visual Feedback**: A clear loading/buffering indicator MUST be displayed
  while the connection is being established.

## Code Standards

- **Components**: Use functional components and hooks exclusively.
- **Naming**: Variables, functions, and components MUST be named in English.
- **UI Text**: All user-facing text MUST be in Portuguese (PT-BR).
- **Dependencies**: Do not use unnecessary third-party UI libraries (e.g., UI
  Kitten, NativeBase). Prefer pure, lightweight components.

## Governance

The Constitution is the supreme document governing all development decisions.
Any amendment requires documented rationale, approval, and a migration plan.
All feature specifications and implementation plans MUST include a Constitution
Check phase. Constitution versioning follows Semantic Versioning
(MAJOR.MINOR.PATCH). Compliance is verified during the planning phase of every
feature.

**Version**: 1.0.0 | **Ratified**: 2026-06-20 | **Last Amended**: 2026-06-20
