import { QuizOfCharacter } from '@world-of-studies/api-types/src/quizzes/quiz_of_character'
import dayjs from 'dayjs'
import { useRouter } from 'expo-router'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, Pressable, View } from 'react-native'

import ExamStatus from '@/components/ExamStatus'
import Container from '@/components/shared/Container'
import Text from '@/components/shared/Text'

type Props = {
  exercice: QuizOfCharacter
}

export default function ExamCard({ exercice }: Readonly<Props>) {
  const router = useRouter()
  const { t } = useTranslation()

  const today = dayjs()

  const isStarted = today.isAfter(dayjs(exercice.startAt))
  const dueTime = dayjs(isStarted ? exercice.endAt : exercice.startAt).format('DD MMM YYYY')

  const isCompleted = exercice.last_quiz_instance_status === 'completed'
  const isPressable = isStarted && today.isBefore(exercice.endAt) && !isCompleted

  const myStringifiedExercice = JSON.stringify(exercice)
  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: `/(tabs)/exercices/[id]`,
          params: { id: exercice.id, exercice: myStringifiedExercice },
        })
      }
      disabled={!isPressable}
    >
      <Container>
        <View style={styles.cardContent}>
          <View style={styles.statusContainer}>
            <ExamStatus
              status={exercice.last_quiz_instance_status}
              startAt={dayjs(exercice.startAt)}
              endAt={dayjs(exercice.endAt)}
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.examName}>{exercice.name}</Text>
            {isCompleted ? null : (
              <Text style={styles.dueTime}>
                {isStarted ? t('exam.end_at') : t('exam.begin_at')} {dueTime}
              </Text>
            )}
          </View>
        </View>
      </Container>
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          backgroundColor: isPressable ? 'transparent' : 'black',
          opacity: 0.2,
          borderRadius: 8,
        }}
      />
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
  },
})
