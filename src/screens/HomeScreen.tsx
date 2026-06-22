import { View, Text, Image, ImageBackground, StyleSheet } from "react-native"
import PlayButton from "../components/PlayButton"
import { STATION_NAME } from "../constants"

export default function HomeScreen() {
  return (
    <ImageBackground
      source={require("../../assets/Beach-mobile-wallpaper.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Image
            source={require("../../assets/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>{STATION_NAME}</Text>
          <Text style={styles.subtitle}>Ao vivo com a melhor programação</Text>
          <PlayButton />
        </View>
      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  logo: {
    width: 240,
    height: 240,
    marginBottom: 24,
    borderRadius: 120,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#F6F2E6",
    marginBottom: 48,
  },
})
