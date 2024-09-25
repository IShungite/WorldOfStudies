import { Quiz, Question, CreateUserAnswerDto } from '@world-of-studies/api-types/src/quizzes'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useAtom } from 'jotai'
import { useState, useEffect } from 'react'
import { ActivityIndicator, StyleSheet } from 'react-native'

import QuizCompleted from '@/components/QuizCompleted'
import ChoiceQuestion from '@/components/choice-question'
import Button from '@/components/shared/Button'
import Card from '@/components/shared/Card'
import GradientContainer from '@/components/shared/GradientContainer'
import Text from '@/components/shared/Text'
import TextHoleQuestion from '@/components/texthole-question'
import { useStartQuiz } from '@/hooks/useStartQuiz'
import { useSubmitAnswer } from '@/hooks/useUserAnswers'
import { selectedCharacterAtom } from '@/providers/selected-character'

type QuestionComponentProps = {
  question: Question & {
    choices?: { id: string; label: string; isCorrect?: boolean }[] // Make isCorrect optional
    text?: string
    answers?: string[]
  }
  onNext: () => void
  handleSubmitAnswer: (questionId: string, answer: any) => void
}

const QuestionComponent = ({ question, onNext, handleSubmitAnswer }: QuestionComponentProps) => {
  if (question.type === 'qcm' && question.choices) {
    return <ChoiceQuestion question={question} onNext={onNext} handleSubmitAnswer={handleSubmitAnswer} />
  } else if (question.type === 'text-hole' && question.text && question.answers) {
    return <TextHoleQuestion question={question} onNext={onNext} handleSubmitAnswer={handleSubmitAnswer} />
  }
  return <Text style={styles.errorText}>Les données de la question sont manquantes.</Text>
}

export default function ExerciceDetail() {
  const { exercice, isAiMode } = useLocalSearchParams<{
    exercice: string
    isAiMode?: string
  }>()
  const router = useRouter()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedCharacter] = useAtom(selectedCharacterAtom)
  const [quizCompleted, setQuizCompleted] = useState(false)

  // Parse isAiMode as a boolean (checking for 'true' or 'false' strings)
  const isAi = isAiMode === 'true'

  const quiz: Quiz = JSON.parse(exercice)

  const currentQuestion = quiz.questions[currentQuestionIndex]

  const { mutate: startQuiz, data: quizInstanceId, isLoading: startQuizLoading, error: startQuizError } = useStartQuiz()
  const { mutate: submitAnswer, isLoading: submitAnswerLoading } = useSubmitAnswer()

  // Prevent the useEffect from being triggered multiple times, start the quiz only if not in AI mode
  useEffect(() => {
    if (selectedCharacter && !quizInstanceId && !startQuizLoading && !isAi) {
      console.log('Starting Quiz with Quiz ID:', quiz.id, 'and Character ID:', selectedCharacter.id)
      startQuiz(
        { quizId: quiz.id, characterId: selectedCharacter.id },
        {
          onError: (error) => {
            console.error('Error starting quiz:', error)
          },
        }
      )
    } else if (isAi) {
      // If it's AI mode, just calculate total points without starting the quiz
    }
  }, [quiz, selectedCharacter, quizInstanceId, startQuizLoading, startQuiz, isAi])

  const handleSubmitAnswer = async (questionId: string, answer: any) => {
    // Skip submitting answers if in AI mode
    if (isAi) {
      console.log('AI Mode: No answers submitted.')
      return
    }

    if (!quizInstanceId || !selectedCharacter) return

    const payload =
      currentQuestion?.type === 'qcm'
        ? { type: 'qcm', questionId, choiceId: answer, characterId: selectedCharacter.id }
        : { type: 'text-hole', questionId, values: answer, characterId: selectedCharacter.id }

    console.log('Submitting Answer for Question ID:', questionId, 'with Payload:', payload)
    submitAnswer(
      { quizInstanceId, questionId, payload },
      {
        onSuccess: () => {
          console.log('Answer Submitted Successfully for Question ID:', questionId)
        },
        onError: (error) => {
          console.error('Failed to submit answer:', error)
        },
      }
    )
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < (quiz?.questions.length ?? 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      console.log('Moving to the Next Question, Current Index:', currentQuestionIndex + 1)
    } else {
      setQuizCompleted(true)
      console.log('Quiz Completed')
    }
  }

  if (startQuizLoading || submitAnswerLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />
  }

  if (startQuizError) {
    return <Text>Erreur lors du chargement du quiz</Text>
  }

  if (quizCompleted && isAi) {
    return (
      <GradientContainer>
        <Text>VICTOIRE</Text>
        <Text style={styles.pointsText}>Vous avez terminé le quizz.</Text>
        <Button title="Fermer le quiz" onPress={() => handleCloseQuiz} />
      </GradientContainer>
    )
  }
  const handleCloseQuiz = () => {
    router.replace('/(app)/(tabs)/exercices')
  }

  if (quizCompleted) {
    return <QuizCompleted quizInstanceId={quizInstanceId} />
  }

  return (
    <Card title={quiz.name}>
      {currentQuestion && (
        <QuestionComponent
          question={currentQuestion}
          onNext={handleNextQuestion}
          handleSubmitAnswer={(questionId: string, answer: CreateUserAnswerDto) =>
            handleSubmitAnswer(questionId, answer)
          }
        />
      )}
    </Card>
  )
}

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 24,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 16,
  },
  pointsText: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 20,
  },
})
