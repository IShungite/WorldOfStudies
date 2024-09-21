import React from 'react'
import { View, ScrollView, StyleSheet } from 'react-native'
import { LineChart } from 'react-native-gifted-charts'

import Card from '@/components/shared/Card'
import GradientContainer from '@/components/shared/GradientContainer'
import Text from '@/components/shared/Text'
import { useStatistics } from '@/hooks/useStatistics'

export default function Statistics() {
  const { stats, loading } = useStatistics()

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Chargement...</Text>
      </View>
    )
  }

  if (!stats) {
    return (
      <View style={styles.center}>
        <Text>Erreur lors du chargement des statistiques</Text>
      </View>
    )
  }

  const { subjects, generalAverage } = stats.result

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.title}>Vos statistiques</Text>

      {subjects.map((subject) => {
        const chartData = subject.quizzes.map((quiz) => ({
          value: quiz.score,
          label: new Date(quiz.date).toLocaleDateString(undefined, {
            month: '2-digit',
            day: 'numeric',
          }),
        }))

        return (
          <GradientContainer key={subject.name} style={styles.cardContainer}>
            <Card title={subject.name}>
              <View style={styles.cardContent}>
                {subject.quizzes.map((quiz) => (
                  <Text key={quiz.name} style={styles.quizText}>
                    {quiz.name}: {quiz.score}/20
                  </Text>
                ))}
                <Text style={styles.subjectAverage}>
                  {subject.name} Moyenne: {subject.average}/20
                </Text>

                <LineChart
                  data={chartData}
                  width={280}
                  height={200}
                  thickness={3}
                  maxValue={20}
                  color="#bfd4ff"
                  dataPointsColor="#fff"
                  isAnimated
                  curved
                  showValuesAsDataPointsText
                  xAxisLabelTextStyle={styles.xAxisText}
                  yAxisTextStyle={styles.xAxisText}
                />
              </View>
            </Card>
          </GradientContainer>
        )
      })}

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
  cardContainer: {
    marginBottom: 16,
    overflow: 'hidden',
  },
  cardContent: {
    marginVertical: 10,
    marginRight: 30,
  },
  quizText: {
    fontSize: 18,
    marginBottom: 5,
    color: '#fff',
    marginLeft: 10,
  },
  subjectAverage: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#fff',
    marginLeft: 10,
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
  xAxisText: {
    fontSize: 12,
    color: '#fff',
  },
})
