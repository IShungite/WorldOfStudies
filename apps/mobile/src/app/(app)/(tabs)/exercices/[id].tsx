import { Stack, useLocalSearchParams } from 'expo-router'
import { View, Text } from 'react-native'

export default function ExerciceDetail() {
  const { id } = useLocalSearchParams()

  return (
    <View>
      <Stack.Screen options={{ headerShown: false }} />
      <Text>ExerciceDetail {id}</Text>
    </View>
  )
}
