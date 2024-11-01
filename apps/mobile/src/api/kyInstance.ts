import ky from 'ky'

import HttpException from '@/exceptions/http.exception'
import { tokenAtom, tokenStore } from '@/providers/token.atom'

const kyInstance = ky.create({
  prefixUrl: `${process.env.EXPO_PUBLIC_API_URL}`,
  headers: {
    'Content-Type': 'application/json',
  },
  hooks: {
    beforeRequest: [
      (request) => {
        const token = tokenStore.get(tokenAtom)
        request.headers.append('Authorization', `Bearer ${token}`)
      },
    ],
    afterResponse: [
      async (_request, _option, response) => {
        if (!response.ok) {
          const data = (await response.json()) as { errors: string[] } | { message: string }
          throw new HttpException('message' in data ? data.message : data.errors.map((error) => error).join('\n'))
        }
      },
    ],
  },
})
export default kyInstance
