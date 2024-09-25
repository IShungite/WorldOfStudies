import { PaginatedResponse } from '@world-of-studies/api-types/src/pagination/paginated_response'
import { QuizOfCharacter } from '@world-of-studies/api-types/src/quizzes/quiz_of_character'
import { useQuery } from 'react-query'

import kyInstance from '@/api/kyInstance'

export const useQuizzes = (characterId: string) => {
  return useQuery({
    queryKey: ['quizzes', characterId],
    // check if characterId is empty string and if it is, return an error
    enabled: characterId !== '',

    queryFn: async (): Promise<PaginatedResponse<QuizOfCharacter>> => {
      const response = await kyInstance.get(`characters/${characterId}/quizzes/`)
      const jsonData: PaginatedResponse<QuizOfCharacter> = await response.json()

      return jsonData
    },
  })
}
