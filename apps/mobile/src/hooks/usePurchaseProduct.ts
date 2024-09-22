import { PurchaseProductResponse } from '@world-of-studies/api-types/src/shop'
import { useMutation } from 'react-query'

import kyInstance from '@/api/kyInstance'

export const usePurchaseProduct = () => {
  return useMutation(
    async ({ shopId, productId, characterId }: { shopId: string; productId: string; characterId: string }) => {
      const response = await kyInstance.post(`shops/${shopId}/products/${productId}/purchase`, {
        json: { characterId },
      })
      return response.json() as Promise<PurchaseProductResponse>
    }
  )
}
