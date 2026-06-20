import { View, Text, StyleSheet } from "react-native"
import PlayButton from "../components/PlayButton"
import { STATION_NAME } from "../constants"

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoPlaceholder}>
          <Text style={styles.logoText}>FM</Text>
        </View>
        <Text style={styles.title}>{STATION_NAME}</Text>
        <Text style={styles.subtitle}>Aperte o play e sinta o ritmo</Text>
        <PlayButton />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  logoPlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#1DB954",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  logoText: {
    fontSize: 64,
    fontWeight: "bold",
    color: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#aaa",
    marginBottom: 48,
  },
})
