import { Quiz, Question, StartQuizResponse } from '@world-of-studies/api-types/src/quizzes'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useAtom } from 'jotai'
import { useState, useEffect } from 'react'
import { StyleSheet } from 'react-native'

import kyInstance from '@/api/kyInstance'
import ChoiceQuestion from '@/components/choice-question'
import Button from '@/components/shared/Button'
import Card from '@/components/shared/Card'
import GradientContainer from '@/components/shared/GradientContainer'
import Text from '@/components/shared/Text'
import TextHoleQuestion from '@/components/texthole-question'
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
  return <Text style={styles.errorText}>Question data is missing.</Text>
}

export default function ExerciceDetail() {
  const { exercice } = useLocalSearchParams<{ exercice: string }>()
  const quiz: Quiz = JSON.parse(exercice)
  const router = useRouter()

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [quizInstanceId, setQuizInstanceId] = useState<string | null>(null)
  const [selectedCharacter] = useAtom(selectedCharacterAtom)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [pointsEarned, setPointsEarned] = useState(0)
  const [totalPoints] = useState(quiz.questions.reduce((total, q) => total + q.points, 0))

  const currentQuestion = quiz.questions[currentQuestionIndex]

  useEffect(() => {
    const startQuiz = async () => {
      if (selectedCharacter && quiz && !quizInstanceId) {
        try {
          const response = await kyInstance.post(`quizzes/${quiz.id}/start`, {
            json: { characterId: selectedCharacter.id },
          })
          const data: StartQuizResponse = await response.json()
          setQuizInstanceId(data.result.id)
        } catch (error) {
          if (error instanceof Error && error.message.includes('The Quiz is already started')) {
            try {
              const response = await kyInstance.get(`quizzes/${quiz.id}/instances?characterId=${selectedCharacter.id}`)
              const data: StartQuizResponse = await response.json()
              setQuizInstanceId(data.result.id)
            } catch (fetchError) {
              console.error('Failed to retrieve existing quiz instance:', fetchError)
            }
          } else {
            console.error('Failed to start the quiz:', error)
          }
        }
      }
    }

    startQuiz()
  }, [selectedCharacter, quiz, quizInstanceId])

  const handleSubmitAnswer = async (questionId: string, answer: any) => {
    if (!quizInstanceId || !selectedCharacter) return

    const payload =
      currentQuestion.type === 'qcm'
        ? { type: 'qcm', questionId, choiceId: answer, characterId: selectedCharacter.id }
        : { type: 'text-hole', questionId, values: answer, characterId: selectedCharacter.id }

    try {
      await kyInstance.post(`quiz-instances/${quizInstanceId}/questions/${questionId}/user-answers`, {
        json: payload,
      })

      if (currentQuestion.type === 'qcm') {
        const correctChoice = currentQuestion.choices?.find((c) => c.isCorrect)?.id
        if (correctChoice?.toString() === answer?.toString()) {
          setPointsEarned((prevPoints) => prevPoints + currentQuestion.points)
        }
      } else if (currentQuestion.type === 'text-hole') {
        const correctAnswers = currentQuestion.answers || []
        const correctCount = answer.filter(
          (a: string, i: number) => a.toLowerCase() === correctAnswers[i].toLowerCase()
        ).length
        setPointsEarned((prevPoints) => prevPoints + (correctCount * currentQuestion.points) / correctAnswers.length)
      }
    } catch (error) {
      console.error('Failed to submit answer:', error)
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      setQuizCompleted(true)
    }
  }

  const handleCloseQuiz = () => {
    router.push('/(app)/(tabs)/exercices')
  }

  if (quizCompleted) {
    return (
      <GradientContainer>
        <Text style={styles.title}>Your answers have been registered.</Text>
        <Text style={styles.pointsText}>
          You scored {pointsEarned}/{totalPoints} points.
        </Text>
        <Button title="Close Quiz" onPress={handleCloseQuiz} />
      </GradientContainer>
    )
  }

  return (
    <Card title={quiz.name}>
      {currentQuestion && (
        <QuestionComponent
          question={currentQuestion}
          onNext={handleNextQuestion}
          handleSubmitAnswer={handleSubmitAnswer}
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
    marginVertical: 20,
    fontSize: 18,
    fontWeight: 'bold',
  },
})
