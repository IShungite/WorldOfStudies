import { Character } from '@world-of-studies/api-types/src/character/character'
import { CharacterListResponse } from '@world-of-studies/api-types/src/character/character_list_response'
import { useQuery } from 'react-query'

import kyInstance from '@/api/kyInstance'

export function useMyCharacters() {
  const { isLoading, data, error } = useQuery<Character[]>({
    queryKey: 'user-characters',
    queryFn: async () => {
      const response = await kyInstance.get('me/characters')
      const json = (await response.json()) as CharacterListResponse
      return json.results.map((item) => item.result)
    },
  })

  return { isLoading, data, error }
}
