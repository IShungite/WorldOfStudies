import { router, Stack } from 'expo-router'
import { useAtom } from 'jotai'
import { useEffect } from 'react'
import { Text, View } from 'react-native'

import { useMyCharacters } from '@/hooks/useMyCharacters'
import { selectedCharacterAtom } from '@/providers/selected-character'

export default function AppLayout() {
  const [, setSelectedCharacter] = useAtom(selectedCharacterAtom)

  const { data, isLoading } = useMyCharacters()

  useEffect(() => {
    if (data !== undefined && data.length === 0) {
      return router.replace('/create-character')
    }

    if (data) {
      setSelectedCharacter({ result: data[0] })
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
