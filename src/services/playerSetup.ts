import TrackPlayer, { Capability, AppKilledPlaybackBehavior } from "react-native-track-player"
import { STREAM_URL } from "../constants"

export async function setupPlayer(): Promise<void> {
  await TrackPlayer.setupPlayer({
    autoHandleInterruptions: true,
  })

  await TrackPlayer.updateOptions({
    android: {
      appKilledPlaybackBehavior:
        AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
    },
    capabilities: [
      Capability.Play,
      Capability.Pause,
      Capability.Stop,
    ],
    compactCapabilities: [
      Capability.Play,
      Capability.Pause,
    ],
  })
}

export async function addStreamTrack(): Promise<void> {
  if (!STREAM_URL) {
    throw new Error(
      "EXPO_PUBLIC_STREAM_URL não configurado. Crie um arquivo .env na raiz do projeto com EXPO_PUBLIC_STREAM_URL=https://seu-servidor/stream"
    )
  }
  await TrackPlayer.add({
    url: STREAM_URL,
    title: "Japaratinga FM",
    artist: "Japaratinga FM",
    isLiveStream: true,
  })
}

export async function setupAndAddTrack(): Promise<void> {
  await setupPlayer()
  await addStreamTrack()
}
