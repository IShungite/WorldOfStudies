import { GetQuizInstanceStatsResponse } from '@world-of-studies/api-types/src/quizzes/get_quiz_instance_stats_response'
import { useQuery } from 'react-query'

import kyInstance from '@/api/kyInstance'

export const useQuizStats = (quizInstanceId: string) => {
  return useQuery<GetQuizInstanceStatsResponse>(
    ['quizStats', quizInstanceId],
    async () => {
      const response = await kyInstance.get(`quiz-instances/${quizInstanceId}/stats`)
      return await response.json()
    },
    {
      enabled: !!quizInstanceId, // Only fetch if quizInstanceId is available
    }
  )
}
