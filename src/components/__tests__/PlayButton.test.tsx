import React from "react"
import { render } from "@testing-library/react-native"
import PlayButton from "../PlayButton"
import { usePlayerStore } from "../../store/usePlayerStore"

describe("PlayButton", () => {
  it("shows play icon when idle", () => {
    usePlayerStore.setState({ isPlaying: false, isBuffering: false })
    const { getByText } = render(<PlayButton />)
    expect(getByText("▶️")).toBeTruthy()
  })

  it("shows pause icon when playing", () => {
    usePlayerStore.setState({ isPlaying: true, isBuffering: false })
    const { getByText } = render(<PlayButton />)
    expect(getByText("⏸")).toBeTruthy()
  })

  it("shows spinner when buffering", () => {
    usePlayerStore.setState({ isPlaying: false, isBuffering: true })
    const { queryByText, getByRole } = render(<PlayButton />)
    expect(queryByText("▶️")).toBeNull()
    expect(queryByText("⏸")).toBeNull()
  })
})
