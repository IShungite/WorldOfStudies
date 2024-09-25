import { useFocusEffect } from '@react-navigation/native'
import { QuizType } from '@world-of-studies/api-types/src/quizzes/quiz-type'
import { QuizOfCharacter } from '@world-of-studies/api-types/src/quizzes/quiz_of_character'
import { useAtom } from 'jotai'
import { useCallback } from 'react'
import { View } from 'react-native'

import ExerciceCard from '@/components/exercice-card'
import Text from '@/components/shared/Text'
import { useQuizzes } from '@/hooks/useQuizzes'
import { selectedCharacterAtom } from '@/providers/selected-character'

export default function ExercisesScreen() {
  const [selectedCharacterResponse] = useAtom(selectedCharacterAtom)
  const selectedCharacter = selectedCharacterResponse || null
  const characterId = selectedCharacter?.id ?? ''

  const { data, refetch, isLoading, error } = useQuizzes(characterId)

  useFocusEffect(
    useCallback(() => {
      if (characterId) refetch() // Only refetch if characterId exists
    }, [refetch, characterId])
  )

  if (isLoading) {
    return <Text>Loading...</Text>
  }

  if (error) {
    return <Text>Error loading quizzes</Text>
  }

  return (
    <View style={{ marginHorizontal: 10 }}>
      {data?.results && data.results.length > 0 ? (
        data.results
          .filter((quiz) => quiz.type === QuizType.PRACTICE)
          .sort((a, b) => {
            const getScore = (quiz: QuizOfCharacter) => (quiz.last_quiz_instance_status === 'in-progress' ? 1 : 2)
            return getScore(a) - getScore(b)
          })
          .map((exercise: QuizOfCharacter) => <ExerciceCard key={exercise.id} exercice={exercise} />)
      ) : (
        <Text>No quizzes available</Text>
      )}
    </View>
  )
}
