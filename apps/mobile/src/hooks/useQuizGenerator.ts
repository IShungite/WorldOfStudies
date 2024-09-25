import { QuestionType, Quiz } from '@world-of-studies/api-types/src/quizzes'
import { QuizType } from '@world-of-studies/api-types/src/quizzes/quiz-type'
import { useMutation } from 'react-query'

// Simulated delay function
const fakeApiCall = <T extends unknown>(data: T, delay: number = 1000): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay)
  })
}

// Define the type of the quiz
// type GeneratedQuiz = {
//   id: string
//   name: string
//   type: 'exercice'
//   questions: {
//     choices?: { id: string; isCorrect: boolean; label: string }[]
//     answers?: string[]
//     points: number
//     question?: string
//     text?: string
//     type: 'qcm' | 'text-hole'
//   }[]
//   startAt: string | null
//   endAt: string | null
// }

// Function to emulate the POST request and return a generated quiz
const postQuizData = async ({ subject, theme }: { subject: string; theme: string }): Promise<Quiz> => {
  const requestBody = {
    'type': 'exercice',
    subject,
    'sous-sujet': theme,
    'moyenne': 10, // Hardcoded for now
  }

  console.log('Sending request to API:', requestBody)

  // Simulating the response from API
  const fakeQuizResponse: Quiz = {
    name: `Quizz ${subject} les multiplications`,
    id: '1',
    type: QuizType.PRACTICE,
    startAt: 'null',
    endAt: 'null',
    questions: [
      {
        id: '1',
        choices: [
          { id: '1', isCorrect: false, label: '108' },
          { id: '2', isCorrect: true, label: '104' },
          { id: '3', isCorrect: false, label: '96' },
          { id: '4', isCorrect: false, label: '100' },
        ],
        points: 1,
        text: 'Quel est le résultat de 4 * 26 ?',
        type: QuestionType.QCM,
      },
      {
        id: '2',
        choices: [
          { id: '5', isCorrect: true, label: '7' },
          { id: '6', isCorrect: false, label: '12' },
          { id: '7', isCorrect: false, label: '17' },
          { id: '8', isCorrect: false, label: '10' },
        ],
        points: 1,
        text: 'Quel est le résultat de 28 / 4 ?',
        type: QuestionType.QCM,
      },
      {
        id: '3',
        choices: [
          { id: '9', isCorrect: false, label: '264' },
          { id: '10', isCorrect: false, label: '246' },
          { id: '11', isCorrect: true, label: '256' },
          { id: '12', isCorrect: false, label: '251' },
        ],
        points: 1,
        text: 'Quel est le carré de 16 ?',
        type: QuestionType.QCM,
      },
      {
        id: '4',
        answers: ['56'],
        points: 1,
        text: 'Le produit de 8 et 7 est @@.',
        type: QuestionType.TEXT_HOLE,
      },
    ],
  }

  // Simulate API delay
  return fakeApiCall(fakeQuizResponse, 2000)
}

// Hook to trigger the quiz generation
export const useGenerateQuiz = () => {
  return useMutation(({ subject, theme }: { subject: string; theme: string }) => postQuizData({ subject, theme }))
}
