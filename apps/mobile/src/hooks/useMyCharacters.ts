import { useQuery } from 'react-query'

import kyInstance from '@/api/kyInstance'

export function useMyCharacters() {
  const { isLoading, data } = useQuery({
    queryKey: 'user-characters',
    queryFn: async () => {
      const response = await kyInstance.get('me/characters')
      const { results } = (await response.json()) as { results: { result: { name: string; id: string } }[] }
      return results.map(({ result }) => result)
    },
  })

  return { isLoading, data }
}
