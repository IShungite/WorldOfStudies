import { QuizOfCharacter } from '@world-of-studies/api-types/src/quizzes/quiz_of_character'
import dayjs from 'dayjs'
import { useRouter } from 'expo-router'
import React from 'react'
import { StyleSheet, Pressable, View } from 'react-native'

import Container from '@/components/shared/Container'
import Text from '@/components/shared/Text'

type Props = {
  exercice: QuizOfCharacter
}

export default function ExamCard({ exercice }: Props) {
  const router = useRouter()

  if (!exercice) {
    return <Text>Quiz indéfini</Text>
  }
  // Don't render the exam if it's completed
  if (exercice.last_quiz_instance_status === 'completed') {
    return null
  }

  const isStarted = dayjs().isAfter(dayjs(exercice.startAt))
  const dueTime = isStarted
    ? `Due: ${dayjs(exercice.endAt).format('MMM DD, YYYY')}`
    : `Starts: ${dayjs(exercice.startAt).format('MMM DD, YYYY')}`

  const getExamStatus = (exercice: QuizOfCharacter) => {
    if (exercice.last_quiz_instance_status === 'completed') return 'Completed'
    if (exercice.last_quiz_instance_status === null) return 'Not Started'
    return 'In Progress'
  }

  const quizStatus = getExamStatus(exercice)

  console.log('Mon exo: ', exercice)
  console.log('Mon json: ', JSON.stringify(exercice))
  const myStringifiedExercice = JSON.stringify(exercice)
  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: `/(tabs)/exercices/[id]`, // Keep this path as it is correct
          params: { id: exercice.id, exercice: myStringifiedExercice },
        })
      }
      style={styles.pressable}
    >
      <Container>
        <View style={styles.cardContent}>
          <View style={styles.statusContainer}>
            <Text style={styles.statusText}>{quizStatus}</Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.examName}>{exercice.name}</Text>
            <Text style={styles.dueTime}>{dueTime}</Text>
          </View>
        </View>
      </Container>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  pressable: {
    marginVertical: 10,
    marginHorizontal: 5,
    borderRadius: 8,
  },
  cardContent: {
    padding: 15,
    position: 'relative',
    minHeight: 100,
  },
  textContainer: {
    marginTop: 25,
  },
  examName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  dueTime: {
    fontSize: 14,
    color: '#ccc',
  },
  statusContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#ffdd57',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    color: '#333',
    fontWeight: 'bold',
  },
})
