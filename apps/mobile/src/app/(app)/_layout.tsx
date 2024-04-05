import { Stack } from 'expo-router'

export default function AppLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="create-character" options={{ headerShown: false }} />
      <Stack.Screen name="select-character" options={{ headerShown: false }} />
    </Stack>
  )
}
