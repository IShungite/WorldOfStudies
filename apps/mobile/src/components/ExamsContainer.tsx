import dayjs from 'dayjs'
import { useFocusEffect } from 'expo-router'
import { useAtomValue } from 'jotai'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, StyleSheet, View } from 'react-native'

import ExamCard from '@/components/exam-card'
import Card from '@/components/shared/Card'
import PageLoader from '@/components/shared/PageLoader'
import Text from '@/components/shared/Text'
import { useQuizzes } from '@/hooks/useQuizzes'
import { selectedCharacterAtom } from '@/providers/selected-character'

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
    const availableQuizzes = examQuizzes
      .filter((quiz) => quiz.last_quiz_instance_status !== 'completed')
      .sort((a, b) => dayjs(a.startAt).diff(dayjs(b.startAt)))

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
