import { QuestionType } from '@world-of-studies/api-types/src/quizzes/question'
import { QuizAi } from '@world-of-studies/api-types/src/quizzes/quiz-ai'
import { UserAnswerDto } from '@world-of-studies/api-types/src/quizzes/user-answers'
import { useRouter } from 'expo-router'
import React from 'react'
import { StyleSheet } from 'react-native'

import Button from '@/components/shared/Button'
import GradientContainer from '@/components/shared/GradientContainer'
import Text from '@/components/shared/Text'

type Props = {
  quiz: QuizAi
  answers: UserAnswerDto[]
}

const QuizCompletedAi = ({ quiz, answers }: Props) => {
  const router = useRouter()

  const points = quiz.questions.reduce((acc, question, index) => {
    const answer = answers[index]

    if (question.type === QuestionType.QCM && answer.type === QuestionType.QCM && question.choices) {
      const choice = question.choices.find((choice) => choice.id === answer.choiceId)

      if (choice) {
        return acc + (choice.isCorrect ? question.points : 0)
      }
    }

    if (question.type === QuestionType.TEXT_HOLE && answer.type === QuestionType.TEXT_HOLE && question.answers) {
      const totalGoodAnswers = question.answers.filter(
        (questionAnswer, index) => questionAnswer === answer.values[index]
      ).length

      const totalAnswers = question.answers.length

      return acc + (totalGoodAnswers / totalAnswers) * question.points
    }

    return acc
  }, 0)

  const totalPoints = quiz.questions.reduce((acc, question) => {
    return acc + question.points
  }, 0)

  const handleCloseQuiz = () => {
    router.push('/(app)/(tabs)/')
  }
  Math.round(points)
  return (
    <GradientContainer>
      <Text>Terminé</Text>
      <Text style={styles.pointsText}>
        Vous avez obtenu {points}/{totalPoints} points.
      </Text>
      <Button title="Fermer le quiz" onPress={handleCloseQuiz} />
    </GradientContainer>
  )
}

export default QuizCompletedAi

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 24,
    fontWeight: 'bold',
  },

  pointsText: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 20,
  },
})
