# Feature Specification: Core Radio Player

**Feature Branch**: `001-core-radio-player`

**Created**: 2026-06-20

**Status**: Draft

**Input**: User description: "Core Radio Player - Home screen with playback engine, Icecast streaming, background audio, native controls"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Listen to Live Radio (Priority: P1)

As a listener, I want to open the app, see the station identity and a Play button,
tap to start listening, see that the app is connecting, and then hear the live
broadcast. I also want the audio to keep playing if I lock my screen or switch
to another app.

**Why this priority**: This is the core value of the application — without it the
app serves no purpose.

**Independent Test**: The app can be installed on a device, opened, and the
listener can tap Play, observe the loading state, hear audio, and verify that
audio continues when the screen is locked or the app is backgrounded.

**Acceptance Scenarios**:

1. **Given** the app is freshly installed and opened, **When** the listener
   taps the Play button, **Then** a visual loading indicator is shown while the
   connection is established
2. **Given** the loading indicator is shown, **When** the connection succeeds,
   **Then** audio begins playing and the button changes to a Pause icon
3. **Given** audio is playing, **When** the listener taps Pause, **Then** audio
   stops and the button changes back to a Play icon
4. **Given** audio is playing, **When** the listener locks the screen or
   minimizes the app, **Then** audio continues playing without interruption
5. **Given** audio was paused and some time has passed, **When** the listener
   taps Play again, **Then** the app reconnects to the live broadcast (does
   NOT resume from the buffered position)

---

### User Story 2 - Control Playback via Native Controls (Priority: P2)

As a listener, I want to pause and resume the radio using the lock-screen media
controls on my phone (iOS Control Center or Android notification), so that I
don't need to open the app to control playback.

**Why this priority**: Enhances the listening experience but is not required to
deliver the core playback functionality.

**Independent Test**: With audio playing from the app, the listener can lock
the screen, use the native media controls to pause, then use them again to
resume — all without unlocking the phone.

**Acceptance Scenarios**:

1. **Given** audio is playing and the screen is locked, **When** the listener
   uses the native pause control, **Then** audio stops and the control updates
   to show a Play icon
2. **Given** audio is paused and the screen is locked, **When** the listener
   uses the native play control, **Then** audio resumes

---

### User Story 3 - Handle Network Interruptions (Priority: P2)

As a listener, I want the app to gracefully handle temporary connection loss.
If the stream drops, the app should show a loading state and automatically
resume playback when the connection is restored.

**Why this priority**: Essential for a robust listening experience, but the core
playback can be delivered and tested without it.

**Independent Test**: With audio playing, the device's network is disconnected.
The app shows a loading/reconnecting state. When the network is restored, audio
resumes automatically.

**Acceptance Scenarios**:

1. **Given** audio is playing, **When** the network connection is lost,
   **Then** the app shows a loading/buffering indicator
2. **Given** the app is in a loading state due to connection loss, **When** the
   network connection is restored, **Then** audio resumes playing without
   requiring user interaction

---

### Edge Cases

- **Phone call interruption**: An incoming call pauses the audio. After the call
  ends, the audio should resume automatically (platform-dependent behavior).
- **App cold start**: The app opens with audio off. Playback only starts after
  explicit user action (tap Play).
- **Rapid play/pause toggling**: Rapidly tapping Play/Pause should not leave the
  player in an inconsistent state.
- **No network on launch**: If the device has no connectivity when the app
  opens, tapping Play shows the loading indicator briefly and then returns to
  the idle state with a Play button, ready to retry.
- **Stream server down**: If the Icecast server is unreachable, the app shows a
  loading state for a reasonable timeout, then returns to the idle Play state
  and may display a user-friendly message.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The app MUST display the station logo and a single Play button on
  the home screen when opened.
- **FR-002**: The app MUST show a visual loading/buffering indicator when the
  listener taps Play and the connection to the stream is being established.
- **FR-003**: The app MUST begin audio playback once the stream connection is
  established. When resuming after a pause, the app MUST reconnect to the live
  broadcast rather than continuing from the previously buffered position.
- **FR-004**: The Play button MUST change to a Pause button while audio is
  playing and back to Play when paused.
- **FR-005**: Audio playback MUST continue when the app is sent to the
  background or the device screen is locked.
- **FR-006**: The app MUST integrate with the operating system's media controls
  (lock screen / notification shade) showing Play and Pause actions.
- **FR-007**: The app MUST automatically attempt to reconnect and resume
  playback when network connectivity is restored after a drop.
- **FR-008**: The app MUST pause audio playback during an incoming phone call.
- **FR-009**: The app MUST NOT start audio playback automatically on launch;
  playback MUST be initiated by the listener.
- **FR-010**: The streaming URL must be configurable without modifying the
  application code. The production stream URL is
  `https://147.15.107.66.nip.io/stream`, provided via `.env` as
  `EXPO_PUBLIC_STREAM_URL`.

### Key Entities

- **Radio Station**: The broadcast entity identified by a name and logo. Has a
  single live audio stream URL.
- **Player State**: Represents the current playback status — idle, loading
  (buffering), playing, paused, or error/reconnecting.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A listener can open the app, tap Play, and hear audio within 5
  seconds on a typical mobile connection.
- **SC-002**: Audio continues playing without interruption when the listener
  locks the screen or switches to another app.
- **SC-003**: A listener can pause and resume playback using native OS media
  controls without unlocking the device.
- **SC-004**: After a network drop of up to 30 seconds, playback resumes
  automatically within 10 seconds of connectivity being restored.
- **SC-005**: During an incoming phone call, audio pauses within 2 seconds and
  the app does not crash or enter an inconsistent state.

## Assumptions

- The target users are listeners with mobile devices (iOS and Android) and
  internet connectivity.
- The station identity (name and logo graphic) is available as project assets.
- The Icecast streaming server is operational and accessible at the configured
  URL.
- The streaming URL is provided via an external configuration mechanism so it
  can differ between environments (development, production).
- The operating system handles audio focus and phone call interruptions
  according to platform conventions (iOS and Android may behave differently).
