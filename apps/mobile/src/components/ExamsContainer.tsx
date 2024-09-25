import { QuizOfCharacter } from '@world-of-studies/api-types/src/quizzes'
import dayjs from 'dayjs'
import { useFocusEffect } from 'expo-router'
import { useAtomValue } from 'jotai'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, View } from 'react-native'

import ExamCard from '@/components/exam-card'
import Card from '@/components/shared/Card'
import PageLoader from '@/components/shared/PageLoader'
import Text from '@/components/shared/Text'
import { useQuizzes } from '@/hooks/useQuizzes'
import { selectedCharacterAtom } from '@/providers/selected-character'

const getQuizRank = (quiz: QuizOfCharacter) => {
  const now = dayjs()

  const startAt = dayjs(quiz.startAt)
  const endAt = dayjs(quiz.endAt)
  const inCurrentPeriod = startAt.isBefore(now) && endAt.isAfter(now)

  if (quiz.last_quiz_instance_status === 'in-progress' && inCurrentPeriod) {
    return 1 // Priorité 1 : quizz 'in-progress' + dans la période du quiz
  }

  const isCompleted = quiz.last_quiz_instance_status === 'completed'

  if (startAt.isBefore(now) && endAt.isAfter(now) && !isCompleted) {
    return 2 // Priorité 2 : quizz actifs (startAt < today < endAt) + non complétés
  }
  if (startAt.isAfter(now)) {
    return 3 // Priorité 3 : quizz à venir (startAt > today)
  }
  if (isCompleted) {
    return 4 // Priorité 4 : quizz complétés
  }
  return 5 // Par défaut, met en dernier les quizz avec un autre statut
}

const ExamsContainer = () => {
  const { t } = useTranslation()

  const selectedCharacter = useAtomValue(selectedCharacterAtom)

  const { data, refetch, isLoading, error } = useQuizzes(selectedCharacter?.id ?? '')

  useFocusEffect(
    useCallback(() => {
      refetch()
    }, [refetch])
  )

  const getContent = () => {
    if (isLoading) {
      return <PageLoader />
    }

    if (error || (!isLoading && !data)) {
      return <Text>Error loading exams</Text>
    }

    const examQuizzes = data?.results.filter((quiz) => quiz.type === 'exam') ?? []
    const availableQuizzes = examQuizzes.sort((a, b) => {
      const rankA = getQuizRank(a)
      const rankB = getQuizRank(b)

      if (rankA !== rankB) {
        return rankA - rankB // Trie selon le rang
      }

      // Si le rang est identique, tri par date de début ascendante
      return dayjs(a.startAt).diff(dayjs(b.startAt))
    })

    if (availableQuizzes.length === 0) {
      return <Text style={{ textAlign: 'center' }}>{t('home.no_exams')}</Text>
    }

    return (
      <FlatList
        data={examQuizzes}
        renderItem={({ item }) => <ExamCard exercice={item} />}
        keyExtractor={(exercice) => exercice.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
        contentContainerStyle={{ paddingHorizontal: 5 }}
      />
    )
  }

  return (
    <View>
      <Card
        title={t('home.exam_title')}
        containerStyle={{ marginTop: 10, marginHorizontal: 30 }}
        contentStyle={{ padding: 5 }}
      />

      <View style={{ marginTop: 10 }}>{getContent()}</View>
    </View>
  )
}

export default ExamsContainer
