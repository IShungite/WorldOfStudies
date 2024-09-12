import { Card } from '@rneui/themed'
import { Quiz } from '@world-of-studies/api-types/src/quizzes'
import { useRouter } from 'expo-router'
import { View, Pressable } from 'react-native'

type Props = {
  exercice: Quiz
}

export default function ExerciceCard({ exercice }: Readonly<Props>) {
  const router = useRouter()
  return (
    <Pressable
      onPress={() =>
        router.push({ pathname: `/exercices/[id]`, params: { id: exercice.id, exercice: JSON.stringify(exercice) } })
      }
    >
      <Card>
        <Card.Title>{exercice.name}</Card.Title>
        <Card.Divider />
        <View />
      </Card>
    </Pressable>
  )
}
