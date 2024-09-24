import { useFocusEffect } from '@react-navigation/native'
import { Quiz } from '@world-of-studies/api-types/src/quizzes/quiz'
import { useCallback } from 'react'
import { View } from 'react-native'

import ExerciceCard from '@/components/exercice-card'
import Text from '@/components/shared/Text'
import { useQuizzes } from '@/hooks/useQuizzes'

export default function ExercisesScreen() {
  const { data, refetch, isLoading, error } = useQuizzes()

  useFocusEffect(
    useCallback(() => {
      refetch()
    }, [refetch])
  )

  // Handle loading state
  if (isLoading) {
    return <Text>Loading...</Text>
  }

  // Handle error state
  if (error) {
    return <Text>Error loading quizzes</Text>
  }

  // Safely access data and map through it
  return (
    <View>
      {Array.isArray(data) && data.length > 0 ? (
        data.map((exercise: Quiz) => <ExerciceCard key={exercise.id} exercice={exercise} />)
      ) : (
        <Text>No quizzes available</Text>
      )}
    </View>
  )
}
