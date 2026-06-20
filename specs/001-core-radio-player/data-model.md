# Data Model: Core Radio Player

## Entities

### RadioStation

Represents the broadcast station being listened to.

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Station display name (e.g., "Japaratinga FM") |
| `logoUrl` | ImageSource | Local image asset path for the station logo |
| `streamUrl` | string | Icecast live stream URL (from env config) |

**Notes**: This is a static configuration entity — values are set at build time
and do not change at runtime.

---

### PlayerState

Represents the current state of the audio player, managed by zustand.

| Field | Type | Description |
|-------|------|-------------|
| `isPlaying` | boolean | Whether audio is currently playing |
| `isBuffering` | boolean | Whether the player is connecting/buffering |

**State transitions**:

```
  ┌─────────┐
  │  IDLE   │  (app launched, no action yet)
  └────┬────┘
       │ tap Play
       ▼
  ┌──────────┐
  │ BUFFERING│  (connecting to Icecast)
  └────┬─────┘
       │ connection established
       ▼
  ┌─────────┐
  │ PLAYING │ ─── tap Pause ──→ ┌─────────┐
  └────┬────┘                   │ PAUSED  │
       │ network drop           └────┬────┘
       ▼                             │ tap Play
  ┌──────────┐                       │
  │ BUFFERING│◄──────────────────────┘
  └────┬─────┘
       │ reconnected
       ▼
  ┌─────────┐
  │ PLAYING │
  └─────────┘
  ```

**Edge transitions**:
- **Phone call**: PLAYING → PAUSED (automatic, OS-driven) → PLAYING (after call
  ends, platform-dependent)
- **Server down**: BUFFERING → IDLE (timeout, no connection possible)
- **App cold start**: IDLE (no auto-play per FR-009)

---

## Store Interface (Zustand)

```typescript
interface PlayerStore {
  isPlaying: boolean;
  isBuffering: boolean;
  play: () => Promise<void>;
  pause: () => Promise<void>;
  setBuffering: (value: boolean) => void;
}
```

**Behavior**:
- `play()`: Calls `TrackPlayer.play()`, sets `isPlaying = true`
- `pause()`: Calls `TrackPlayer.pause()`, sets `isPlaying = false`
- `setBuffering()`: Used by event listeners to indicate network/loading state
- Store syncs with `TrackPlayer.playbackState` via event subscription
