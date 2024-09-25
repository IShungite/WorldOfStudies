import { QuestionType, QuizAi, QuizFromGPT } from '@world-of-studies/api-types/src/quizzes'
import { QuizType } from '@world-of-studies/api-types/src/quizzes/quiz-type'
import { useMutation } from 'react-query'

type QuizGeneratorBody = {
  type: string
  subject: string
  sous_sujet: string
  moyenne: number
}

const postQuizData = async ({ subject, theme }: { subject: string; theme: string }): Promise<QuizAi> => {
  const body: QuizGeneratorBody = { type: QuizType.PRACTICE, subject, sous_sujet: theme, moyenne: 10 }

  const res = await fetch(`${process.env.EXPO_PUBLIC_IA_URL}/generatequizz`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  console.log('Quiz response:', res)
  const data = (await res.json()) as QuizFromGPT

  console.log('Quiz data:', data)
  return transform(data)
}

const transform = (data: QuizFromGPT): QuizAi => {
  return {
    ...data,
    questions: data.questions.map((question) => ({
      isAnswered: false,
      question: {
        ...question,
        text: question.type === 'qcm' ? question.question : question.text,
      },
    })),
  }
}

// Hook to trigger the quiz generation
export const useGenerateQuiz = () => {
  return useMutation(({ subject, theme }: { subject: string; theme: string }) => postQuizData({ subject, theme }))
}
