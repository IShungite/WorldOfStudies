import { useMutation } from 'react-query'

import kyInstance from '@/api/kyInstance'

export const useSubmitAnswer = () => {
  return useMutation(
    async ({ quizInstanceId, questionId, payload }: { quizInstanceId: string; questionId: string; payload: any }) => {
      try {
        await kyInstance.post(`quiz-instances/${quizInstanceId}/questions/${questionId}/user-answers`, {
          json: payload,
        })
      } catch (error) {
        console.error('Échec de la soumission de la réponse:', error)
        throw error
      }
    }
  )
}
