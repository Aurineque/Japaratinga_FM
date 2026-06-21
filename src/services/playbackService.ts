import TrackPlayer, { Event } from "react-native-track-player"
import { usePlayerStore } from "../store/usePlayerStore"

export async function playbackService(): Promise<void> {
  TrackPlayer.addEventListener(Event.RemotePlay, () => {
    TrackPlayer.play()
    usePlayerStore.getState().setIsPlaying(true)
  })

  TrackPlayer.addEventListener(Event.RemotePause, () => {
    TrackPlayer.pause()
    usePlayerStore.getState().setIsPlaying(false)
  })

  TrackPlayer.addEventListener(Event.RemoteStop, () => {
    TrackPlayer.stop()
    usePlayerStore.getState().setIsPlaying(false)
  })
}
