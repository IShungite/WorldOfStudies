import { CharacterInventoryResponse } from '@world-of-studies/api-types/src/character'
import { InventoryItem } from '@world-of-studies/api-types/src/inventory'
import { useQuery } from 'react-query'

import kyInstance from '@/api/kyInstance'

export function useInventory(characterId: string) {
  const { isLoading, data } = useQuery<InventoryItem[]>({
    queryKey: ['inventory', characterId],
    queryFn: async () => {
      const response = await kyInstance.get(`characters/${characterId}/inventory`)
      const json = (await response.json()) as CharacterInventoryResponse
      return json.result.items
    },
  })

  return { isLoading, data }
}
