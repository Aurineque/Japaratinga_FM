import { useEffect } from "react"
import { StatusBar } from "expo-status-bar"
import TrackPlayer, { Event, State } from "react-native-track-player"
import { setupAndAddTrack } from "./src/services/playerSetup"
import { playbackService } from "./src/services/playbackService"
import { usePlayerStore } from "./src/store/usePlayerStore"
import HomeScreen from "./src/screens/HomeScreen"

TrackPlayer.registerPlaybackService(() => playbackService)

export default function App() {
  const syncState = usePlayerStore((s) => s.syncState)
  const setBuffering = usePlayerStore((s) => s.setBuffering)
  const setIsPlaying = usePlayerStore((s) => s.setIsPlaying)

  useEffect(() => {
    setupAndAddTrack().then(() => {
      syncState()
    })
  }, [syncState])

  useEffect(() => {
    const sub = TrackPlayer.addEventListener(
      Event.PlaybackState,
      (event) => {
        const { state } = event
        setBuffering(
          state === State.Buffering || state === State.Loading
        )
        setIsPlaying(state === State.Playing)
      }
    )
    return () => sub.remove()
  }, [setBuffering, setIsPlaying])

  return (
    <>
      <StatusBar style="light" />
      <HomeScreen />
    </>
  )
}
