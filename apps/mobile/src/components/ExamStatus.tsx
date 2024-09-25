import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import Text from '@/components/shared/Text'

type Props = {
  status: 'in-progress' | 'completed' | null
}

const color = {
  'in-progress': '#ffe26f',
  'completed': '#a6d49f',
  'not-started': '#e9e9e9',
}

const ExamStatus = ({ status }: Props) => {
  const { t } = useTranslation()

  const realStatus = status ?? 'not-started'

  return (
    <View style={[styles.statusContainer, { backgroundColor: color[realStatus] }]}>
      <Text style={styles.statusText}>{t(`exam.status.${realStatus}`)}</Text>
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
