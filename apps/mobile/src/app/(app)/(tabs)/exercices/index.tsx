import { Quiz } from '@world-of-studies/api-types'
import { Text, View } from 'react-native'
import { useQuery } from 'react-query'

import kyInstance from '@/api/kyInstance'
import ExerciceCard from '@/components/exercice-card'

export default function ExercisesScreen() {
  const { data } = useQuery({
    queryKey: 'quizzes',
    queryFn: async () => {
      const response = await kyInstance.get('quizzes')
      const { results } = (await response.json()) as { results: { result: Quiz }[] }
      return results.map(({ result }) => result)
    },
  })

  return (
    <View>
      <Text>Exercises</Text>
      {data?.map((exercise) => <ExerciceCard key={exercise.id} exercice={exercise} />)}
    </View>
  )
}
