import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from "react-native"
import { usePlayerStore } from "../store/usePlayerStore"

export default function PlayButton() {
  const isPlaying = usePlayerStore((s) => s.isPlaying)
  const isBuffering = usePlayerStore((s) => s.isBuffering)
  const play = usePlayerStore((s) => s.play)
  const pause = usePlayerStore((s) => s.pause)

  const handlePress = () => {
    if (isPlaying) {
      pause()
    } else {
      play()
    }
  }

  if (isBuffering) {
    return (
      <TouchableOpacity style={styles.button} disabled>
        <ActivityIndicator size="large" color="#fff" />
      </TouchableOpacity>
    )
  }

  return (
    <TouchableOpacity style={styles.button} onPress={handlePress}>
      <Text style={styles.icon}>{isPlaying ? "⏸" : "▶️"}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#04B2BD",
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  icon: {
    fontSize: 40,
  },
})
