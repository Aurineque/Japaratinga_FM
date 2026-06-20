import TrackPlayer, { Event } from "react-native-track-player"

export async function playbackService(): Promise<void> {
  TrackPlayer.addEventListener(Event.RemotePlay, () => {
    TrackPlayer.play()
  })

  TrackPlayer.addEventListener(Event.RemotePause, () => {
    TrackPlayer.pause()
  })

  TrackPlayer.addEventListener(Event.RemoteStop, () => {
    TrackPlayer.stop()
  })
}
