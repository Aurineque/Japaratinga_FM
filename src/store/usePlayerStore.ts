import { create } from "zustand"
import TrackPlayer, { State } from "react-native-track-player"

interface PlayerStore {
  isPlaying: boolean
  isBuffering: boolean
  play: () => Promise<void>
  pause: () => Promise<void>
  setBuffering: (value: boolean) => void
  syncState: () => Promise<void>
}

export const usePlayerStore = create<PlayerStore>((set) => ({
  isPlaying: false,
  isBuffering: false,

  play: async () => {
    set({ isBuffering: true })
    try {
      await TrackPlayer.play()
      set({ isPlaying: true, isBuffering: false })
    } catch {
      set({ isBuffering: false })
    }
  },

  pause: async () => {
    await TrackPlayer.pause()
    set({ isPlaying: false })
  },

  setBuffering: (value: boolean) => {
    set({ isBuffering: value })
  },

  syncState: async () => {
    const playbackState = await TrackPlayer.getPlaybackState()
    const isPlaying = playbackState.state === State.Playing
    set({ isPlaying })
  },
}))
