declare module "*.png" {
  const value: import("react-native").ImageSource
  export default value
}

declare module "*.jpg" {
  const value: import("react-native").ImageSource
  export default value
}

declare var process: {
  env: {
    EXPO_PUBLIC_STREAM_URL?: string
  }
}
