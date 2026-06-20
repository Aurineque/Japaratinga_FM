# Quickstart: Core Radio Player

## Prerequisites

- Node.js 18+
- Expo CLI (`npx expo`)
- iOS Simulator (macOS) or Android Emulator / physical device
- A running Icecast server with a stream URL

## Setup

### 1. Install Dependencies

```bash
npx expo install react-native-track-player zustand expo-constants
npx expo install expo-build-properties
```

### 2. Configure Environment

Create `.env` in project root:

```env
EXPO_PUBLIC_STREAM_URL=https://your-server.nip.io/stream
```

### 3. Configure app.json

Add the build properties plugin:

```json
{
  "expo": {
    "plugins": [
      "expo-build-properties"
    ]
  }
}
```

### 4. Start Development

```bash
npx expo start
```

Press `i` for iOS simulator or `a` for Android emulator.

## Testing

### Manual Test Flow

1. Open the app → logo and Play button visible
2. Tap Play → loading spinner appears
3. Audio starts → button changes to Pause
4. Lock screen / minimize → audio continues
5. Use lock-screen controls → Pause/Resume works
6. Kill network → loading spinner reappears
7. Restore network → audio resumes

### Unit Tests

```bash
npx jest
```

Tests cover zustand store state transitions and PlayButton rendering.
