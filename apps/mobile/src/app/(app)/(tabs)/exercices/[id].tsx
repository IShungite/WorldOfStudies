import { Card, Text, Button } from '@rneui/themed'
import { Quiz, Question, StartQuizResponse } from '@world-of-studies/api-types/src/quizzes'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useAtom } from 'jotai'
import { useState, useEffect } from 'react'
import { View, StyleSheet } from 'react-native'

import kyInstance from '@/api/kyInstance'
import ChoiceQuestion from '@/components/choice-question'
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
          // Check for the specific "Quiz already started" error
          if (error instanceof Error && error.message.includes('The Quiz is already started')) {
            console.log('Quiz already started, retrieving existing instance')
            // Fetch existing quiz instance if it’s already started
            try {
              const response = await kyInstance.get(`quizzes/${quiz.id}/instances?characterId=${selectedCharacter.id}`)
              const data: StartQuizResponse = await response.json()
              setQuizInstanceId(data.result.id) // Set the retrieved quiz instance ID
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

      // QCM (Multiple Choice) Question Scoring
      if (currentQuestion.type === 'qcm') {
        const correctChoice = currentQuestion.choices?.find((c) => c.isCorrect)?.id
        if (correctChoice?.toString() === answer?.toString()) {
          setPointsEarned((prevPoints) => prevPoints + currentQuestion.points)
        }
      }

      // Text-Hole Question Scoring
      else if (currentQuestion.type === 'text-hole') {
        const correctAnswers = currentQuestion.answers || []
        const correctCount = answer.filter(
          (a: string, i: number) => a.toLowerCase() === correctAnswers[i].toLowerCase()
        ).length
        setPointsEarned((prevPoints) => prevPoints + (correctCount * currentQuestion.points) / correctAnswers.length)
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Failed to submit answer:', error.message)
      } else {
        console.error('An unknown error occurred:', error)
      }
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
    router.push('/(app)/(tabs)/exercices') // Redirect to quiz list
  }

  if (quizCompleted) {
    return (
      <View style={styles.container}>
        <Text h4 style={styles.title}>
          Your answers have been registered.
        </Text>
        <Text h4 style={styles.pointsText}>
          You scored {pointsEarned}/{totalPoints} points.
        </Text>
        <Button title="Close Quiz" onPress={handleCloseQuiz} />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text h4 style={styles.title}>
        Exercice Detail: {quiz.name}
      </Text>
      {currentQuestion && (
        <Card containerStyle={styles.card}>
          <QuestionComponent
            question={currentQuestion}
            onNext={handleNextQuestion}
            handleSubmitAnswer={handleSubmitAnswer}
          />
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
  pointsText: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 18,
    fontWeight: 'bold',
  },
})
