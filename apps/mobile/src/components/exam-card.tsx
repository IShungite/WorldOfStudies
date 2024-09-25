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

  const isStarted = dayjs().isAfter(dayjs(exercice.startAt))
  const dueTime = dayjs(isStarted ? exercice.endAt : exercice.startAt).format('MMM DD, YYYY')

  const myStringifiedExercice = JSON.stringify(exercice)
  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: `/(tabs)/exercices/[id]`,
          params: { id: exercice.id, exercice: myStringifiedExercice },
        })
      }
    >
      <Container>
        <View style={styles.cardContent}>
          <View style={styles.statusContainer}>
            <ExamStatus status={exercice.last_quiz_instance_status} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.examName}>{exercice.name}</Text>
            <Text style={styles.dueTime}>
              {isStarted ? t('exam.begin_at') : t('exam.end_at')} {dueTime}
            </Text>
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
  },
})
