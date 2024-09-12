import { Card, Text } from '@rneui/themed'
import { Quiz, Question } from '@world-of-studies/api-types/src/quizzes'
import { useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import { View, StyleSheet } from 'react-native'

import ChoiceQuestion from '@/components/choice-question'
import TextHoleQuestion from '@/components/texthole-question'

type QuestionComponentProps = {
  question: Question
  onNext: () => void
}

const QuestionComponent = ({ question, onNext }: QuestionComponentProps) => {
  if (question.type === 'qcm') {
    // Changed from question to question.type
    return <ChoiceQuestion question={question} onNext={onNext} />
  } else if (question.type === 'text-hole') {
    return <TextHoleQuestion question={question} onNext={onNext} />
  }
  return <Text style={styles.errorText}>Question data is missing.</Text>
}

export default function ExerciceDetail() {
  const { exercice } = useLocalSearchParams<{ exercice: string }>()
  const quiz: Quiz = JSON.parse(exercice)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  const currentQuestion = quiz.questions[currentQuestionIndex]

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  return (
    <View style={styles.container}>
      <Text h4 style={styles.title}>
        Exercice Detail: {quiz.name}
      </Text>
      {currentQuestion && (
        <Card containerStyle={styles.card}>
          <QuestionComponent question={currentQuestion} onNext={handleNextQuestion} />
        </Card>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
})
