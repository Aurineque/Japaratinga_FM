import {
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  Linking,
  StyleSheet,
} from "react-native"
import PlayButton from "../components/PlayButton"
import { STATION_NAME } from "../constants"

const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/japaratinga_fm/",
  whatsapp: "https://wa.me/558281535949",
} as const

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
          <View style={styles.socialRow}>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => Linking.openURL(SOCIAL_LINKS.instagram)}
              activeOpacity={0.7}
            >
              <Text style={styles.socialIcon}>📷</Text>
              <Text style={styles.socialLabel}>Instagram</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => Linking.openURL(SOCIAL_LINKS.whatsapp)}
              activeOpacity={0.7}
            >
              <Text style={styles.socialIcon}>💬</Text>
              <Text style={styles.socialLabel}>WhatsApp</Text>
            </TouchableOpacity>
          </View>
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
  socialRow: {
    flexDirection: "row",
    gap: 24,
  },
  socialButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  socialIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  socialLabel: {
    fontSize: 12,
    color: "#F6F2E6",
  },
})
