# Research: Core Radio Player

## 1. Icecast Stream URL Configuration

**Decision**: The stream URL is provided at build-time via `.env` file using
Expo's `EXPO_PUBLIC_` environment variable prefix. No hardcoded URL in source.

**Rationale**: The constitution mandates env-based configuration. Expo SDK 52+
supports `EXPO_PUBLIC_` prefix for client-side env vars without additional
dependencies.

**Alternatives considered**:
- `react-native-dotenv` — extra dependency, unnecessary now that Expo has native
  env var support
- Hardcoded URL — violates constitution principle V

**Resolved**: The production Icecast URL is
`https://147.15.107.66.nip.io/stream`, provided via `EXPO_PUBLIC_STREAM_URL` in
`.env`.

---

## 2. react-native-track-player v4 Setup (Expo Managed)

**Decision**: Use `react-native-track-player` v4 with Expo managed workflow via
`expo-build-properties` plugin for native module configuration.

**Rationale**: The constitution mandates react-native-track-player. v4 is the
current stable version. In Expo managed workflow, native modules require the
`expo-build-properties` plugin in `app.json` to link properly.

**Key findings**:
- Install: `npx expo install react-native-track-player`
- Add to `app.json` plugins: `["expo-build-properties"]`
- Configure `AudioMode` with `androidAudioContentType: "music"` and
  `androidAudioFocusGainType: "gain"`
- Track objects for live streams use `isLiveStream: true` and omit `duration`
- `TrackPlayer.registerPlaybackService()` must be called before any component
  mounts (typically in `App.tsx` or `index.js`)
- v4 removed `useTrackPlayerProgress` — use `useProgress` instead

**Alternatives considered**:
- `expo-av` — simpler API but lacks reliable background playback and native
  lock-screen controls
- Bare workflow — more control but violates managed workflow requirement

---

## 3. zustand State Management with TrackPlayer

**Decision**: Create a thin zustand store that mirrors TrackPlayer's playback
state for UI consumption.

**Rationale**: The constitution mandates zustand. TrackPlayer already manages
audio state internally; zustand provides the reactive bridge to the UI layer.

**Best practices**:
- Store should be minimal: `isPlaying`, `isBuffering`, action methods
- Subscribe to `TrackPlayer.playbackState` changes via its event emitter
- Do NOT store the TrackPlayer instance — use the singleton directly
- Use `usePlaybackState()` hook from `react-native-track-player` for reactive
  state instead of manual subscription

**Alternatives considered**:
- React Context — more boilerplate, less performant for frequent state updates
- Redux — overkill for two boolean values

---

## 4. Background Audio & Native Controls

**Decision**: TrackPlayer handles background audio and native controls
automatically when configured correctly. No additional libraries needed.

**Configuration required**:
- **Android**: Set `androidNotificationChannel` in `AppKt` (or via
  `TrackPlayer.setupPlayer()` options). Background mode declared in
  `AndroidManifest.xml` via `expo-build-properties`.
- **iOS**: Enable `audio` background mode in `Info.plist` (via
  `expo-build-properties` plugin). `UIBackgroundModes: ["audio"]`.

**Capabilities to register**: play, pause, stop (seek and skipNext/skipPrevious
not needed for live stream).

**Phone call handling**: TrackPlayer pauses automatically on audio interruption
on both platforms. No custom code needed for basic cases.

---

## 5. Testing Strategy

**Decision**: Manual testing on device/emulator for audio features. Unit tests
for zustand store logic using jest.

**Rationale**: Audio playback and native controls cannot be meaningfully tested
in a headless test environment. The core UI logic (button states, store
transitions) is simple enough for unit tests.

**Approach**:
- `usePlayerStore` unit tests: verify state transitions (idle → loading →
  playing → paused)
- `PlayButton` component test: verify correct icon rendered per store state
- Manual playback test: APK/IPA install, full user flow verification
