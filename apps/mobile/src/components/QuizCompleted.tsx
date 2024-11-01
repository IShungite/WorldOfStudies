import { useRouter } from 'expo-router'
import React from 'react'
import { ActivityIndicator, StyleSheet } from 'react-native'

import Button from '@/components/shared/Button'
import GradientContainer from '@/components/shared/GradientContainer'
import Text from '@/components/shared/Text'
import { useQuizStats } from '@/hooks/useQuizStat'

type Props = {
  quizInstanceId?: string
}

const QuizCompleted = ({ quizInstanceId }: Props) => {
  const router = useRouter()

  const { data, isLoading } = useQuizStats(quizInstanceId ?? '')

  const handleCloseQuiz = () => {
    router.push('/(app)/(tabs)/exercices')
  }

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />
  }

  if (!data) {
    return null
  }

  return (
    <GradientContainer>
      <Text>Terminé</Text>
      <Text style={styles.pointsText}>
        Vous avez obtenu {data.result.score}/{data.result.maxScore} points.
      </Text>
      <Button title="Fermer le quiz" onPress={handleCloseQuiz} />
    </GradientContainer>
  )
}

export default QuizCompleted

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 24,
    fontWeight: 'bold',
  },

  pointsText: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 20,
  },
})
