import React from 'react'
import { View, ScrollView, StyleSheet } from 'react-native'

import Card from '@/components/shared/Card'
import GradientContainer from '@/components/shared/GradientContainer'
import PageLoader from '@/components/shared/PageLoader'
import Text from '@/components/shared/Text'
import SubjectStatistics from '@/components/subject-statistic-card'
import { useStatistics } from '@/hooks/useStatistics'

export default function Statistics() {
  const { stats, loading } = useStatistics()

  if (loading) {
    return <PageLoader />
  }

  if (!stats) {
    return (
      <View style={styles.center}>
        <Text>Erreur lors du chargement des statistiques</Text>
      </View>
    )
  }

  const { subjects, generalAverage } = stats

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.title}>Vos statistiques</Text>

      {subjects.map((subject, index) => (
        <SubjectStatistics
          key={`${subject.name}_${index}`}
          name={subject.name}
          quizzes={subject.quizzes}
          average={subject.average}
        />
      ))}

      <GradientContainer style={styles.generalCardContainer}>
        <Card title="Moyenne générale">
          <Text style={styles.generalAverage}>{generalAverage}/20</Text>
        </Card>
      </GradientContainer>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 16,
    backgroundColor: '#f0f0f0',
    flexGrow: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  generalCardContainer: {
    marginTop: 20,
  },
  generalAverage: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
