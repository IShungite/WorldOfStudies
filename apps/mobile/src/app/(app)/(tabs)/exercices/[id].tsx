import { Quiz, Question, CreateUserAnswerDto } from '@world-of-studies/api-types/src/quizzes'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useAtom } from 'jotai'
import { useState, useEffect } from 'react'
import { ActivityIndicator, StyleSheet } from 'react-native'

import ChoiceQuestion from '@/components/choice-question'
import Button from '@/components/shared/Button'
import Card from '@/components/shared/Card'
import GradientContainer from '@/components/shared/GradientContainer'
import Text from '@/components/shared/Text'
import TextHoleQuestion from '@/components/texthole-question'
import { useQuizzes } from '@/hooks/useQuizzes'
import { useStartQuiz } from '@/hooks/useStartQuiz'
import { useSubmitAnswer } from '@/hooks/useUserAnswers'
import { selectedCharacterAtom } from '@/providers/selected-character'

type QuestionComponentProps = {
  question: Question & {
    choices?: { id: string; label: string; isCorrect: boolean }[]
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
  const { exercice, quizId, isAiMode } = useLocalSearchParams<{
    exercice?: string
    quizId?: string
    isAiMode?: string
  }>()
  const router = useRouter()

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedCharacter] = useAtom(selectedCharacterAtom)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [pointsEarned, setPointsEarned] = useState(0)
  const [totalPoints, setTotalPoints] = useState(0)

  // Parse isAiMode as a boolean (checking for 'true' or 'false' strings)
  const isAi = isAiMode === 'true'

  let quiz: Quiz | null = exercice ? JSON.parse(exercice) : null
  const { data: fetchedQuiz, isLoading: quizLoading, error: quizError } = useQuizzes(quizId)

  // Only assign the fetched quiz if it is not an array
  if (!quiz && fetchedQuiz && !Array.isArray(fetchedQuiz)) {
    quiz = fetchedQuiz
  }

  const currentQuestion = quiz?.questions[currentQuestionIndex]

  const { mutate: startQuiz, data: quizInstanceId, isLoading: startQuizLoading, error: startQuizError } = useStartQuiz()
  const { mutate: submitAnswer, isLoading: submitAnswerLoading } = useSubmitAnswer()

  // Prevent the useEffect from being triggered multiple times, start the quiz only if not in AI mode
  useEffect(() => {
    if (selectedCharacter && quiz && !quizInstanceId && !startQuizLoading && !isAi) {
      console.log('Starting Quiz with Quiz ID:', quiz.id, 'and Character ID:', selectedCharacter.id)
      startQuiz(
        { quizId: quiz.id, characterId: selectedCharacter.id },
        {
          onSuccess: () => {
            const total = quiz.questions.reduce((total, q) => total + q.points, 0)
            setTotalPoints(total)
            console.log('Total Points Calculated:', total)
          },
          onError: (error) => {
            console.error('Error starting quiz:', error)
          },
        }
      )
    } else if (isAi) {
      // If it's AI mode, just calculate total points without starting the quiz
      const total = quiz?.questions.reduce((total, q) => total + q.points, 0) || 0
      setTotalPoints(total)
      console.log('AI Mode: Total Points Calculated:', total)
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

    try {
      console.log('Submitting Answer for Question ID:', questionId, 'with Payload:', payload)
      submitAnswer(
        { quizInstanceId, questionId, payload },
        {
          onSuccess: () => {
            console.log('Answer Submitted Successfully for Question ID:', questionId)
            if (currentQuestion?.type === 'qcm') {
              const correctChoice = currentQuestion?.choices?.find((c) => c.isCorrect)?.id
              if (correctChoice?.toString() === answer?.toString()) {
                setPointsEarned((prevPoints) => prevPoints + currentQuestion.points)
              }
            } else if (currentQuestion?.type === 'text-hole') {
              const correctAnswers = currentQuestion.answers || []
              const correctCount = answer.filter(
                (a: string, i: number) => a.toLowerCase() === correctAnswers[i].toLowerCase()
              ).length
              setPointsEarned(
                (prevPoints) => prevPoints + (correctCount * currentQuestion.points) / correctAnswers.length
              )
            }
          },
          onError: (error) => {
            console.error('Failed to submit answer:', error)
          },
        }
      )
    } catch (error) {
      console.error('Failed to submit answer:', error)
    }
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

  const handleCloseQuiz = () => {
    router.push('/(app)/(tabs)/exercices')
  }

  if (quizLoading || startQuizLoading || submitAnswerLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />
  }

  if (quizError || startQuizError) {
    console.error('Error fetching or starting quiz:', quizError || startQuizError)
    return <Text style={styles.errorText}>An error occurred while loading the quiz</Text>
  }

  if (quizCompleted) {
    return (
      <GradientContainer>
        <Text style={styles.title}>Vos réponses ont été enregistrées.</Text>
        <Text style={styles.pointsText}>
          Vous avez obtenu {pointsEarned}/{totalPoints} points.
        </Text>
        <Button title="Fermer le quiz" onPress={handleCloseQuiz} />
      </GradientContainer>
    )
  }

  return (
    <Card title={quiz?.name || 'Loading Quiz...'}>
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
