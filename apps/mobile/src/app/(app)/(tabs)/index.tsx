import { useFocusEffect } from '@react-navigation/native'
import { QuizOfCharacter } from '@world-of-studies/api-types/src/quizzes'
import { useAtomValue } from 'jotai'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet, View } from 'react-native'

import ExamCard from '@/components/exam-card'
import QuizGeneratorOverlay from '@/components/quiz-generator-overlay'
import Button from '@/components/shared/Button'
import Card from '@/components/shared/Card'
import PageLoader from '@/components/shared/PageLoader'
import Text from '@/components/shared/Text'
import { useQuizzes } from '@/hooks/useQuizzes'
import { selectedCharacterAtom } from '@/providers/selected-character'

export default function HomeScreen() {
  const { t } = useTranslation()
  const selectedCharacter = useAtomValue(selectedCharacterAtom)

  const { data, refetch, isLoading, error } = useQuizzes(selectedCharacter?.id ?? '')

  const [overlayVisible, setOverlayVisible] = useState(false)

  useFocusEffect(
    useCallback(() => {
      refetch()
    }, [refetch])
  )

  if (isLoading) {
    return <PageLoader />
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>Error loading exams</Text>
      </View>
    )
  }

  const examQuizzes = data?.results.filter((quiz) => quiz.type === 'exam') || []

  if (examQuizzes.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No exams available</Text>
      </View>
    )
  }

  return (
    <>
      <Card title={t('home.exam_title')} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollContainer}>
        {examQuizzes
          .filter((exercise) => exercise.last_quiz_instance_status !== 'completed')
          .map((exercise: QuizOfCharacter) => (
            <ExamCard key={exercise.id} exercice={exercise} />
          ))}
      </ScrollView>

      {/* "Générer un quiz IA" Button */}
      <View style={styles.centered}>
        <Button title="Générer un quiz IA" onPress={() => setOverlayVisible(true)} />
      </View>

      {/* Quiz Generator Overlay */}
      <QuizGeneratorOverlay isVisible={overlayVisible} onClose={() => setOverlayVisible(false)} />
    </>
  )
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  scrollContainer: {
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
})
