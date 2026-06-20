---

description: "Task list for Core Radio Player feature"
---

# Tasks: Core Radio Player

**Input**: Design documents from `specs/001-core-radio-player/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Mobile**: `src/` at repository root (Expo/React Native single project)

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and install dependencies

- [ ] T001 Initialize Expo project with TypeScript strict mode in `tsconfig.json`
- [ ] T002 Install dependencies: `npx expo install react-native-track-player zustand expo-constants expo-build-properties`
- [ ] T003 [P] Configure `app.json` with `expo-build-properties` plugin
- [ ] T004 [P] Create `.env` with `EXPO_PUBLIC_STREAM_URL=https://147.15.107.66.nip.io/stream`
- [ ] T005 Create `src/constants/index.ts` to export env vars

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Player engine and state management — MUST be complete before ANY user story

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T006 Create `src/services/playerSetup.ts` — TrackPlayer initialization with audio config and live stream track
- [ ] T007 Create `src/services/playbackService.ts` — register event handlers for remote play/pause/stop and playback state changes
- [ ] T008 Create `src/store/usePlayerStore.ts` — zustand store with `isPlaying`, `isBuffering`, `play()`, `pause()`, `setBuffering()`
- [ ] T009 Wire playback service registration in `App.tsx` — call `TrackPlayer.registerPlaybackService()` before any component mounts

**Checkpoint**: Foundation ready — player initializes, store syncs with TrackPlayer state

---

## Phase 3: User Story 1 - Listen to Live Radio (Priority: P1) 🎯 MVP

**Goal**: User opens app, sees logo and Play button, taps to start streaming with loading feedback, and audio continues in background.

**Independent Test**: Install APK/IPA, open app, tap Play, see spinner, hear audio, lock screen — audio still plays.

### Implementation for User Story 1

- [ ] T010 [P] [US1] Create `src/components/PlayButton.tsx` — pressable button showing Play/Pause icon or loading spinner based on store state
- [ ] T011 [P] [US1] Add station logo asset to `assets/logo.png`
- [ ] T012 [US1] Create `src/screens/HomeScreen.tsx` — layout with logo image + PlayButton centered, StyleSheet styling, UI text in PT-BR

**Checkpoint**: US1 fully functional — basic playback works end-to-end

---

## Phase 4: User Story 2 (Priority: P2)

**Goal**: User Story 2 — Control Playback via Native Controls

**Goal**: User can pause/resume using lock-screen controls (iOS Control Center / Android notification).

**Independent Test**: Play audio, lock screen, use native pause/resume controls without unlocking.

- [ ] T013 [US2] Ensure playback service handles `RemotePlay` and `RemotePause` events in `src/services/playbackService.ts`
- [ ] T014 [US2] Ensure TrackPlayer capabilities include `play` and `pause` in `src/services/playerSetup.ts`
- [ ] T015 [US2] Verify native control UI updates state correctly (Play icon → Pause icon and vice versa)

**Checkpoint**: US2 functional — native controls work alongside in-app controls

---

## Phase 5: User Story 3 (Priority: P2)

**Goal**: Handle Network Interruptions

**Goal**: App gracefully handles connection drops — shows loading state and auto-reconnects.

**Independent Test**: Play audio, disconnect network, see spinner, reconnect network, audio resumes.

- [ ] T016 [US3] Subscribe to TrackPlayer playback state changes in `App.tsx` to detect buffering/loading states
- [ ] T017 [US3] Update zustand store `isBuffering` flag based on TrackPlayer playback state transitions
- [ ] T018 [US3] Ensure PlayButton shows spinner while `isBuffering === true` (already covered by T010 but verify integration)
- [ ] T019 [US3] Handle phone call interruption — TrackPlayer pauses automatically; verify post-call resume behavior

**Checkpoint**: US3 functional — connection drops and restoration handled gracefully

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T020 [P] Add unit test for `usePlayerStore` state transitions (idle → loading → playing → paused) in `src/store/__tests__/usePlayerStore.test.ts`
- [ ] T021 [P] Add unit test for PlayButton rendering (correct icon per state) in `src/components/__tests__/PlayButton.test.tsx`
- [ ] T022 Run quickstart.md validation — verify manual test flow passes

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - US1 (P1) must be completed first (MVP)
  - US2 and US3 can proceed in any order after US1
- **Polish (Final Phase)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 (P1)**: Can start after Foundational — No dependencies on other stories
- **US2 (P2)**: Depends on US1 (native controls require working playback) — independently testable once US1 is done
- **US3 (P2)**: Depends on US1 (reconnection requires working playback) — independently testable once US1 is done

### Within Each User Story

- Store before components
- Services before screens
- Components before screens
- Core implementation before polish
- Story complete before moving to next priority

### Parallel Opportunities

- T003 and T004 can run in parallel (app.json vs .env)
- T010 and T011 can run in parallel (PlayButton vs logo asset)
- US2 and US3 can be implemented in parallel after US1 is complete

---

## Parallel Example: User Story 1

```bash
# Launch PlayButton and logo asset together:
Task: "Create PlayButton component in src/components/PlayButton.tsx"
Task: "Add station logo asset to assets/logo.png"

# Then HomeScreen (depends on both):
Task: "Create HomeScreen in src/screens/HomeScreen.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test US1 independently (play, pause, background audio)
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Manual device testing required for audio features (emulator may not support audio)
