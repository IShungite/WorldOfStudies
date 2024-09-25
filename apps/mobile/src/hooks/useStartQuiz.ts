import { StartQuizResponse } from '@world-of-studies/api-types/src/quizzes/start_quiz_response'
import { useMutation } from 'react-query'

import kyInstance from '@/api/kyInstance'

export const useStartQuiz = () => {
  return useMutation(async ({ quizId, characterId }: { quizId: string; characterId: string }) => {
    try {
      const response = await kyInstance.post(`quizzes/${quizId}/start`, {
        json: { characterId },
      })
      const data: StartQuizResponse = await response.json()

      const filteredQuestions = data.result.questions.filter((question) => !question.isAnswered)

      // Return the filtered result
      return {
        ...data.result,
        questions: filteredQuestions,
      }
    } catch (error: any) {
      throw error
    }
  })
}
