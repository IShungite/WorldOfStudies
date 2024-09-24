import { Quiz } from '@world-of-studies/api-types/src/quizzes/quiz'
import { QuizResponse } from '@world-of-studies/api-types/src/quizzes/quiz-response'
import { useQuery } from 'react-query'

import kyInstance from '@/api/kyInstance'

export const useQuizzes = (quizId?: string) => {
  return useQuery({
    queryKey: quizId ? ['quiz', quizId] : 'quizzes',
    queryFn: async (): Promise<Quiz | Quiz[]> => {
      const response = await kyInstance.get(quizId ? `quizzes/${quizId}` : 'quizzes')

      if (quizId) {
        // For single quiz, extract 'result'
        const jsonData: { result: Quiz } = await response.json()
        return jsonData.result // Return the single quiz
      } else {
        // For multiple quizzes, map through 'results' and extract 'result'
        const jsonData: { results: QuizResponse[] } = await response.json()
        const quizzes = jsonData.results.map((item) => item.result) // Access the 'result' in each object
        console.log('Quizzes:', quizzes)
        return quizzes // Return array of quizzes
      }
    },
  })
}
