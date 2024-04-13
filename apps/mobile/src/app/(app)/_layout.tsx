import { Stack } from 'expo-router'
import { useAtom } from 'jotai'
import { useEffect } from 'react'
import { Text, View } from 'react-native'
import { useQuery } from 'react-query'

import { selectedCharacterAtom } from '@/providers/selected-character'

export default function AppLayout() {
  const { isLoading, data } = useQuery({
    queryKey: 'user-characters',
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return [
        {
          name: 'Character 1',
        },
      ]
    },
  })

  const [, setSelectedCharacter] = useAtom(selectedCharacterAtom)

  useEffect(() => {
    if (data) {
      setSelectedCharacter(data[0])
    }
  }, [data])

  if (isLoading)
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    )

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="create-character" options={{ headerShown: false }} />
    </Stack>
  )
}
