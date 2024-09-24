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
      return data.result.quizInstanceId // Return the quizInstanceId
    } catch (error: any) {
      // If the quiz is already started, retrieve the existing instance
      if (error.message.includes('The Quiz is already started')) {
        const response = await kyInstance.get(`quizzes/${quizId}/instances?characterId=${characterId}`)
        const data: StartQuizResponse = await response.json()
        return data.result.quizInstanceId // Return the existing quizInstanceId
      }
      throw error // Re-throw error if it's not handled
    }
  })
}
