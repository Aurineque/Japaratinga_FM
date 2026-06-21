import { usePlayerStore } from "../usePlayerStore"

beforeEach(() => {
  usePlayerStore.setState({ isPlaying: false, isBuffering: false })
})

describe("usePlayerStore", () => {
  it("starts with idle state", () => {
    const state = usePlayerStore.getState()
    expect(state.isPlaying).toBe(false)
    expect(state.isBuffering).toBe(false)
  })

  it("sets isBuffering to true when play is called", async () => {
    const { play } = usePlayerStore.getState()
    const promise = play()
    expect(usePlayerStore.getState().isBuffering).toBe(true)
    await promise
  })

  it("sets isPlaying to false after pause", async () => {
    const { pause } = usePlayerStore.getState()
    await pause()
    const state = usePlayerStore.getState()
    expect(state.isPlaying).toBe(false)
  })

  it("setBuffering updates isBuffering state", () => {
    usePlayerStore.getState().setBuffering(true)
    expect(usePlayerStore.getState().isBuffering).toBe(true)

    usePlayerStore.getState().setBuffering(false)
    expect(usePlayerStore.getState().isBuffering).toBe(false)
  })

  it("setIsPlaying updates isPlaying state", () => {
    usePlayerStore.getState().setIsPlaying(true)
    expect(usePlayerStore.getState().isPlaying).toBe(true)

    usePlayerStore.getState().setIsPlaying(false)
    expect(usePlayerStore.getState().isPlaying).toBe(false)
  })
})
