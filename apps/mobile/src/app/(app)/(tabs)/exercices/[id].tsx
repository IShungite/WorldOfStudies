import {
  CreateUserAnswerDto,
  QCMQuestionResponse,
  QuestionType,
  Quiz,
  QuizAi,
  TextHoleQuestionResponse,
  UserAnswerDto,
} from '@world-of-studies/api-types/src/quizzes'
import { useLocalSearchParams } from 'expo-router'
import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { ActivityIndicator, StyleSheet } from 'react-native'

import QuizCompleted from '@/components/QuizCompleted'
import QuizCompletedAi from '@/components/QuizCompletedAi'
import ChoiceQuestion from '@/components/choice-question'
import Card from '@/components/shared/Card'
import Text from '@/components/shared/Text'
import TextHoleQuestion from '@/components/texthole-question'
import { useRefreshSelectedCharacter } from '@/hooks/useRefreshSelectedCharacter'
import { useStartQuiz } from '@/hooks/useStartQuiz'
import { useSubmitAnswer } from '@/hooks/useUserAnswers'
import { selectedCharacterAtom } from '@/providers/selected-character'

type QuestionComponentProps = {
  question: QCMQuestionResponse | TextHoleQuestionResponse
  onNext: () => void
  handleSubmitAnswer: (questionId: string, answer: UserAnswerDto) => Promise<void>
}

const QuestionComponent = ({ question, onNext, handleSubmitAnswer }: QuestionComponentProps) => {
  if (question.type === QuestionType.QCM) {
    return <ChoiceQuestion question={question} onNext={onNext} handleSubmitAnswer={handleSubmitAnswer} />
  } else if (question.type === QuestionType.TEXT_HOLE) {
    return <TextHoleQuestion question={question} onNext={onNext} handleSubmitAnswer={handleSubmitAnswer} />
  }
  return <Text style={styles.errorText}>Les données de la question sont manquantes.</Text>
}

export default function ExerciceDetail() {
  const { exercice, isAiMode } = useLocalSearchParams<{
    exercice: string
    isAiMode?: string
  }>()

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedCharacter] = useAtom(selectedCharacterAtom)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const { refetch: refetchSelectedCharacter } = useRefreshSelectedCharacter()

  // Parse isAiMode as a boolean (checking for 'true' or 'false' strings)
  const isAi = isAiMode === 'true'

  const quiz: Quiz | QuizAi = JSON.parse(exercice)

  console.log('Quiz:', quiz)

  // Fetch the filtered questions
  const {
    mutate: startQuiz,
    data: quizInstanceData,
    isLoading: startQuizLoading,
    error: startQuizError,
  } = useStartQuiz()

  const { mutateAsync: submitAnswer, isLoading: submitAnswerLoading } = useSubmitAnswer()

  console.log({ startQuizLoading })
  console.log({ quizInstanceData: quizInstanceData?.questions })

  const filteredQuestions = isAi ? (quiz as QuizAi).questions : quizInstanceData?.questions || []

  console.log({ filteredQuestions })

  const currentQuestion = filteredQuestions[currentQuestionIndex] // Use the filtered questions

  console.log({ currentQuestion })

  const [answers, setAnswers] = useState<UserAnswerDto[]>([])

  // Prevent the useEffect from being triggered multiple times, start the quiz only if not in AI mode
  useEffect(() => {
    if (selectedCharacter && !quizInstanceData && !startQuizLoading && !isAi) {
      startQuiz(
        { quizId: quiz.id, characterId: selectedCharacter.id },
        {
          onError: (error) => {
            console.error('Error starting quiz:', error)
          },
        }
      )
    }
  }, [quiz, selectedCharacter, quizInstanceData, startQuizLoading, startQuiz, isAi])

  const handleSubmitAnswer = async (questionId: string, answer: UserAnswerDto) => {
    // Skip submitting answers if in AI mode
    if (isAi) {
      setAnswers((prev) => [...prev, answer])
      return
    }

    if (!quizInstanceData?.quizInstanceId || !selectedCharacter) return

    const payload: CreateUserAnswerDto =
      answer.type === QuestionType.QCM
        ? {
            type: QuestionType.QCM,
            questionId,
            choiceId: answer.choiceId,
            characterId: selectedCharacter.id,
          }
        : {
            type: QuestionType.TEXT_HOLE,
            questionId,
            values: answer.values,
            characterId: selectedCharacter.id,
          }

    await submitAnswer(
      { quizInstanceId: quizInstanceData.quizInstanceId, questionId, payload },
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
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      console.log('Moving to the Next Question, Current Index:', currentQuestionIndex + 1)
    } else {
      setQuizCompleted(true)
      refetchSelectedCharacter()
    }
  }

  if (startQuizLoading || submitAnswerLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />
  }

  if (startQuizError) {
    return <Text>Erreur lors du chargement du quiz</Text>
  }

  if (quizCompleted && isAi) {
    return <QuizCompletedAi answers={answers} quiz={quiz as QuizAi} />
  }

  if (quizCompleted) {
    return <QuizCompleted quizInstanceId={quizInstanceData?.quizInstanceId} />
  }

  return (
    <Card title={quiz.name} containerStyle={styles.titleContainer}>
      {currentQuestion && (
        <QuestionComponent
          question={currentQuestion.question}
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
    fontSize: 18,
    fontWeight: 'bold',
  },
  titleContainer: {
    marginTop: 20,
    marginHorizontal: 30,
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
