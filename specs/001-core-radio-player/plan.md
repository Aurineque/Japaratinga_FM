# Implementation Plan: Core Radio Player

**Branch**: `001-core-radio-player` | **Date**: 2026-06-20 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/001-core-radio-player/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Create the core radio player feature: a single-screen app that connects to an
Icecast live stream, displays the station logo and a Play/Pause button, shows a
loading indicator during buffering, continues playback in the background, and
integrates with native OS media controls. Uses Expo managed workflow with
react-native-track-player and zustand.

## Technical Context

**Language/Version**: TypeScript 5.x (Strict mode enabled per constitution)

**Primary Dependencies**:
- Expo SDK 52+ (managed workflow)
- react-native-track-player ^4.x (audio engine, background playback, native
  controls)
- zustand ^5.x (global player state)
- expo-av (audio focus/interruption handling)
- expo-build-properties (native module config plugin)
- react-native-dotenv or expo-constants (env variable access)

**Storage**: None — the app is a live streaming client with no persisted data.

**Testing**: jest + @testing-library/react-native (no audio testing — verified
manually on device/emulator for this phase).

**Target Platform**: iOS 15+ / Android 8+

**Project Type**: mobile-app (Expo managed workflow)

**Performance Goals**:
- Time from Play tap to audible audio: <5 seconds on typical mobile connection
- Zero playback interruptions during background/foreground transitions
- Auto-reconnect within 10 seconds after network restoration

**Constraints**:
- Background audio MUST work without user reinteraction
- Native lock-screen controls MUST show correct Play/Pause state
- Audio MUST pause during phone calls and resume after
- Stream URL MUST be configurable via .env (no code changes)

**Scale/Scope**: Single radio station, single screen, single concurrent listener.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Check | Status |
|-----------|-------|--------|
| I. SDD | Spec exists and approved | ✅ PASS |
| II. Simplicity & Focus | Feature serves core purpose: play live radio | ✅ PASS |
| III. Resilience | Auto-reconnect, connection state feedback, network drop handling | ✅ PASS |
| IV. Tech Stack | RN/Expo, TS Strict, react-native-track-player, zustand | ✅ PASS |
| V. Architecture | Icecast consumer, .env URL, live stream mode | ✅ PASS |
| UI/UX Standards | Background audio, native controls, loading feedback | ✅ PASS |
| Code Standards | Functional components, English code, PT-BR UI | ✅ PASS |

**Result**: All gates pass — no violations requiring complexity justification.

## Project Structure

### Documentation (this feature)

```text
specs/001-core-radio-player/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
Japaratinga_FM/
├── .env                          # Stream URL and config
├── app.json                      # Expo app config + plugins
├── App.tsx                       # Root component (navigation + providers)
├── src/
│   ├── services/
│   │   ├── playbackService.ts    # TrackPlayer event handlers (background)
│   │   └── playerSetup.ts        # TrackPlayer setup + queue
│   ├── store/
│   │   └── usePlayerStore.ts     # Zustand store (isPlaying, isBuffering)
│   ├── screens/
│   │   └── HomeScreen.tsx        # Main screen (logo + PlayButton)
│   ├── components/
│   │   └── PlayButton.tsx        # Play/Pause toggle button
│   └── constants/
│       └── index.ts              # Env vars, stream URL, app metadata
└── assets/
    └── logo.png                  # Station logo image
```

**Structure Decision**: Single-project mobile app layout under `src/` with
services, store, screens, components, and constants directories. Matches Expo
convention and keeps concerns separated.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations — Complexity Tracking section is empty.

## Implementation Steps

### Step 1: Project Bootstrap & Dependencies

1. Ensure Expo CLI is available (`npx expo --version`)
2. Install project dependencies:
   ```bash
   npx expo install react-native-track-player zustand expo-constants
   npx expo install expo-build-properties
   ```
3. Configure `app.json` with the `expo-build-properties` plugin and
   `react-native-track-player` audio mode
4. Create `.env` file with `EXPO_PUBLIC_STREAM_URL` variable

### Step 2: Player Setup Service

File: `src/services/playerSetup.ts`
- Initialize TrackPlayer with audio category (playback)
- Register capability handlers (play, pause, stop)
- Create a track object pointing to the Icecast stream URL
- Set `isLiveStream: true` and no duration
- Export `setupPlayer()` and `addStreamTrack()` functions

### Step 3: Playback Service (Background)

File: `src/services/playbackService.ts`
- Register as the playback service in `App.tsx` via `TrackPlayer.registerPlaybackService()`
- Handle TrackPlayer remote events: `RemotePlay`, `RemotePause`, `RemoteStop`
- Update zustand store on state changes (`PlaybackState`)
- Handle audio interruption events (phone calls)

### Step 4: Zustand Store

File: `src/store/usePlayerStore.ts`
- Create store with:
  - `isPlaying: boolean`
  - `isBuffering: boolean`
  - `play()` — calls `TrackPlayer.play()`, sets states
  - `pause()` — calls `TrackPlayer.pause()`, sets states
  - `setBuffering(value: boolean)` — updates buffering state
- Subscribe to TrackPlayer playback state changes to sync

### Step 5: Constants & Configuration

File: `src/constants/index.ts`
- Read `EXPO_PUBLIC_STREAM_URL` from `process.env`
- Export stream URL, app name, and other constants

### Step 6: PlayButton Component

File: `src/components/PlayButton.tsx`
- Functional component using `usePlayerStore`
- Shows Play icon when `isPlaying === false` and not buffering
- Shows Pause icon when `isPlaying === true`
- Shows ActivityIndicator (spinner) when `isBuffering === true`
- Calls `play()` or `pause()` from store on press
- Large touch target for easy interaction

### Step 7: HomeScreen

File: `src/screens/HomeScreen.tsx`
- Displays station logo image at top center
- Renders PlayButton below the logo
- Clean, minimal layout with high contrast
- Uses StyleSheet for styling (per constitution)
- UI text in Portuguese (PT-BR)

### Step 8: App Entry Point

File: `App.tsx`
- Register playback service on app load
- Call `setupPlayer()` and `addStreamTrack()` on mount
- Render `HomeScreen` as the root component
- Register TrackPlayer event handlers for state sync
