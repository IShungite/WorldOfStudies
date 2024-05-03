import { Card } from '@rneui/themed'
import { Quiz } from '@world-of-studies/api-types'
import { useRouter } from 'expo-router'
import { View, Pressable } from 'react-native'

type Props = {
  exercice: Quiz
}

export default function ExerciceCard({ exercice }: Props) {
  const router = useRouter()
  return (
    <Pressable onPress={() => router.push(`/(app)/(tabs)/exercices/${exercice.id}`)}>
      <Card>
        <Card.Title>{exercice.name}</Card.Title>
        <Card.Divider />
        <View />
      </Card>
    </Pressable>
  )
}
