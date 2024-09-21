import { StatsResponse } from '@world-of-studies/api-types/src/statistics/statistics_response'
import { useState, useEffect } from 'react'

const fakeApiCall = async (): Promise<StatsResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        result: {
          subjects: [
            {
              name: 'Math',
              quizzes: [
                { name: 'Algebra Quiz', score: 18, date: '2024-09-01' },
                { name: 'Geometry Quiz', score: 19, date: '2024-09-05' },
                { name: 'Trigonometry Quiz', score: 13, date: '2024-09-10' },
                { name: 'Calculus Quiz', score: 20, date: '2024-09-15' },
                { name: 'Statistics Quiz', score: 11, date: '2024-09-20' },
              ],
              average: 18,
            },
            {
              name: 'Science',
              quizzes: [
                { name: 'Physics Quiz', score: 12, date: '2024-09-02' },
                { name: 'Chemistry Quiz', score: 7, date: '2024-09-07' },
                { name: 'Biology Quiz', score: 15, date: '2024-09-12' },
                { name: 'Astronomy Quiz', score: 18, date: '2024-09-18' },
                { name: 'Geology Quiz', score: 14, date: '2024-09-25' },
              ],
              average: 17,
            },
          ],
          generalAverage: 17.5,
        },
      })
    }, 1000)
  })
}

export const useStatistics = () => {
  const [stats, setStats] = useState<StatsResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true)
      const data = await fakeApiCall()
      setStats(data)
      setLoading(false)
    }

    fetchStats()
  }, [])

  return { stats, loading }
}
