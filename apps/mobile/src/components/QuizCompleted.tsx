import { useRouter } from 'expo-router'
import React from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'

import Button from '@/components/shared/Button'
import Card from '@/components/shared/Card'
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
    <View style={{ marginTop: 10, marginHorizontal: 40 }}>
      <Card title={data.result.name}>
        <Text style={styles.pointsText}>
          Vous avez obtenu {data.result.score}/{data.result.maxScore}.
        </Text>
        <Button title="Fermer le quiz" onPress={handleCloseQuiz} />
      </Card>
    </View>
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
    color: 'white',
  },
})
