import { SubjectStat } from '@world-of-studies/api-types/src/character/character_stat'
import React from 'react'
import { View, StyleSheet } from 'react-native'
import { LineChart } from 'react-native-gifted-charts'

import Card from '@/components/shared/Card'
import GradientContainer from '@/components/shared/GradientContainer'
import Text from '@/components/shared/Text'

export default function SubjectStatistics({ name, quizzes, average }: Readonly<SubjectStat>) {
  const recentQuizzes = quizzes
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  const chartData = recentQuizzes.map((quiz) => ({
    value: quiz.score,
    label: new Date(quiz.date).toLocaleDateString(undefined, {
      month: '2-digit',
      day: 'numeric',
    }),
  }))

  return (
    <GradientContainer style={styles.cardContainer}>
      <Card title={name}>
        <View style={styles.cardContent}>
          {recentQuizzes.length > 0 ? (
            <>
              <Text style={styles.quizText}>Derniers quiz:</Text>
              {recentQuizzes.map((quiz) => (
                <Text key={quiz.name} style={styles.quizText}>
                  {quiz.name}: {quiz.score}/20
                </Text>
              ))}
              <Text style={styles.subjectAverage}>
                {name} Moyenne: {average}/20
              </Text>

              <LineChart
                data={chartData}
                width={280}
                height={200}
                thickness={3}
                maxValue={20}
                color="#bfd4ff"
                dataPointsColor1="#fff"
                textColor="#fff"
                isAnimated
                curved
                showValuesAsDataPointsText
                xAxisLabelTextStyle={styles.xAxisText}
                yAxisTextStyle={styles.xAxisText}
              />
            </>
          ) : (
            <Text style={{ color: '#bfd4ff', textAlign: 'center' }}>Aucune note</Text>
          )}
        </View>
      </Card>
    </GradientContainer>
  )
}

const styles = StyleSheet.create({
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
  xAxisText: {
    fontSize: 12,
    color: '#fff',
  },
})
