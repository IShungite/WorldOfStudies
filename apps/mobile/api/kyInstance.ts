import ky from 'ky'

import HttpException from '../exceptions/http.exception'

const kyInstance = ky.create({
  prefixUrl: `${process.env.EXPO_PUBLIC_API_URL}`,
  headers: {
    'Content-Type': 'application/json',
  },
  hooks: {
    afterResponse: [
      async (_request, _option, response) => {
        if (!response.ok) {
          const data = (await response.json()) as { errors: string[] }
          throw new HttpException(data.errors.map((error) => error).join('\n'))
        }
      },
    ],
  },
})
export default kyInstance
