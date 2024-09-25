import dayjs from 'dayjs'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import Text from '@/components/shared/Text'

type Props = {
  status: 'in-progress' | 'completed' | null
  startAt: dayjs.Dayjs
  endAt: dayjs.Dayjs
}

const color = {
  'in-progress': '#ffe26f',
  'completed': '#a6d49f',
  'not-started': '#999999',
  'in-waiting': '#c7c7c7',
}

const ExamStatus = ({ status, startAt, endAt }: Props) => {
  const { t } = useTranslation()

  const realStatus = status ?? 'in-waiting'

  const isStarted = startAt.isBefore(dayjs())
  const isEnded = endAt.isBefore(dayjs())

  const computedStatus = isStarted ? (isEnded ? 'completed' : realStatus) : 'not-started'

  const statusText = t(`exam.status.${computedStatus}`)

  return (
    <View style={[styles.statusContainer, { backgroundColor: color[computedStatus] }]}>
      <Text style={styles.statusText}>{statusText}</Text>
    </View>
  )
}

export default ExamStatus

const styles = StyleSheet.create({
  statusContainer: {
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
