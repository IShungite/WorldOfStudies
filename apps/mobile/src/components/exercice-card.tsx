import { QuizOfCharacter } from '@world-of-studies/api-types/src/quizzes/quiz_of_character'
import { useRouter } from 'expo-router'
import React from 'react'
import { StyleSheet, Pressable, View } from 'react-native'

import GradientContainer from '@/components/shared/GradientContainer'
import Text from '@/components/shared/Text'

type Props = {
  exercice: QuizOfCharacter
}

export default function ExerciceCard({ exercice }: Props) {
  const router = useRouter()

  // Filter out quizzes with the type 'EXAM'
  if (exercice.type === 'exam') {
    return null // Do not render this card
  }

  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: `/exercices/[id]`,
          params: { id: exercice.id, exercice: JSON.stringify(exercice) },
        })
      }
      style={styles.pressable}
    >
      <GradientContainer>
        {exercice.last_quiz_instance_status && (
          <View style={styles.statusContainer}>
            <Text style={styles.statusText}>
              {exercice.last_quiz_instance_status === 'in-progress'
                ? 'En cours'
                : exercice.last_quiz_instance_status === 'completed'
                  ? 'Terminé'
                  : exercice.last_quiz_instance_status === 'not_started'
                    ? 'Non commencé'
                    : exercice.last_quiz_instance_status}
            </Text>
          </View>
        )}

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
  statusContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#ffdd57', // Color for status background
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  statusText: {
    color: 'green', // Text color for status
    fontSize: 12,
    fontWeight: 'bold',
  },
})
