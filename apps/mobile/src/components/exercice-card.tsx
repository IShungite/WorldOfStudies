import { Quiz } from '@world-of-studies/api-types/src/quizzes/quiz'
import { useRouter } from 'expo-router'
import React from 'react'
import { StyleSheet, Pressable } from 'react-native'

import GradientContainer from '@/components/shared/GradientContainer'
import Text from '@/components/shared/Text'

type Props = {
  exercice: Quiz
}

export default function ExerciceCard({ exercice }: Props) {
  const router = useRouter()

  const quizInstanceId = exercice.id

  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: `/exercices/[id]`,
          params: { id: exercice.id, exercice: JSON.stringify(exercice), quizInstanceId },
        })
      }
      style={styles.pressable}
    >
      <GradientContainer>
        <Text style={styles.exerciseName}>{exercice.name}</Text>
        <Text style={styles.exerciseText}>Click to start the quiz!</Text>
      </GradientContainer>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  exerciseName: {
    fontSize: 20,
    textAlign: 'center',
    marginVertical: 10,
    color: '#fff',
  },
  pressable: {
    marginVertical: 10,
    borderRadius: 8,
  },
  exerciseText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
    color: '#fff',
  },
})
