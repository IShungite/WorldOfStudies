import { CharacterStatsResponse } from '@world-of-studies/api-types/src/character/character_stats_response'
import { useAtom } from 'jotai'
import { useState, useEffect } from 'react'

import kyInstance from '@/api/kyInstance'
import { selectedCharacterAtom } from '@/providers/selected-character'

export const useStatistics = () => {
  const [stats, setStats] = useState<CharacterStatsResponse['result'] | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedCharacter] = useAtom(selectedCharacterAtom)

  useEffect(() => {
    const fetchStats = async () => {
      if (selectedCharacter) {
        setLoading(true)
        try {
          const response = await kyInstance.get(`characters/${selectedCharacter.id}/stats`)

          const data: CharacterStatsResponse = await response.json()
          setStats(data.result)
        } catch (error) {
          console.error('Failed to fetch character stats:', error)
        } finally {
          setLoading(false)
        }
      }
    }

    fetchStats()
  }, [selectedCharacter])

  return { stats, loading }
}
