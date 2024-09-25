import { CharacterResponse } from '@world-of-studies/api-types/src/character'
import { useAtom } from 'jotai'
import { useQuery } from 'react-query'

import kyInstance from '@/api/kyInstance'
import { selectedCharacterAtom } from '@/providers/selected-character'

export const useRefreshSelectedCharacter = () => {
  const [selectedCharacter, setSelectedCharacter] = useAtom(selectedCharacterAtom)

  return useQuery({
    queryKey: ['selectedCharacter'],
    queryFn: async () => {
      if (!selectedCharacter) {
        return
      }

      const response = await kyInstance.get(`characters/${selectedCharacter.id}`)
      const json = (await response.json()) as CharacterResponse

      setSelectedCharacter(json.result)
    },
  })
}
