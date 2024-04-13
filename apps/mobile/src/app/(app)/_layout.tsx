import { router, Stack } from 'expo-router'
import { useAtom } from 'jotai'
import { useEffect } from 'react'
import { Text, View } from 'react-native'
import { useQuery } from 'react-query'

import kyInstance from '@/api/kyInstance'
import { selectedCharacterAtom } from '@/providers/selected-character'

export default function AppLayout() {
  const { isLoading, data } = useQuery({
    queryKey: 'user-characters',
    queryFn: async () => {
      const response = await kyInstance.get('me/characters')
      const { results } = (await response.json()) as { results: { result: { name: string } }[] }
      return results.map(({ result }) => result)
    },
  })

  const [, setSelectedCharacter] = useAtom(selectedCharacterAtom)

  useEffect(() => {
    if (data !== undefined && data.length === 0) {
      return router.replace('/create-character')
    }

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
