import { useEffect } from "react"
import { StatusBar } from "expo-status-bar"
import TrackPlayer from "react-native-track-player"
import { setupAndAddTrack } from "./src/services/playerSetup"
import { playbackService } from "./src/services/playbackService"
import { usePlayerStore } from "./src/store/usePlayerStore"
import HomeScreen from "./src/screens/HomeScreen"

TrackPlayer.registerPlaybackService(() => playbackService)

export default function App() {
  const syncState = usePlayerStore((s) => s.syncState)

  useEffect(() => {
    setupAndAddTrack().then(() => {
      syncState()
    })
  }, [syncState])

  return (
    <>
      <StatusBar style="light" />
      <HomeScreen />
    </>
  )
}
