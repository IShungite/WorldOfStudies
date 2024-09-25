import { Character } from '@world-of-studies/api-types/src/character'
import { Product } from '@world-of-studies/api-types/src/shop/shop_product'
import { useSetAtom } from 'jotai'
import React from 'react'
import { View, StyleSheet, Image } from 'react-native'

import BerryIcon from '@/components/shared/BerryIcon'
import Button from '@/components/shared/Button'
import Overlay from '@/components/shared/Overlay'
import Text from '@/components/shared/Text'
import { usePurchaseProduct } from '@/hooks/usePurchaseProduct'
import { selectedCharacterAtom } from '@/providers/selected-character'

type Props = {
  isVisible: boolean
  onBackdropPress: () => void
  onPurchase: () => void
  product: Product
  character: Character
}

const ProductOverlay: React.FC<Props> = ({ isVisible, onBackdropPress, onPurchase, product, character }) => {
  const purchaseMutation = usePurchaseProduct()
  const setSelectedCharacter = useSetAtom(selectedCharacterAtom)

  const handlePurchase = async () => {
    if (product && character) {
      purchaseMutation.mutate(
        {
          shopId: character.schoolId,
          productId: product.id,
          characterId: character.id,
        },
        {
          onSuccess: (data) => {
            setSelectedCharacter({ ...character, berries: data.result.berries })
          },
        }
      )
      onPurchase()
    }
  }

  return (
    <Overlay isVisible={isVisible} onBackdropPress={onBackdropPress} title={product.name}>
      <View style={styles.content}>
        <Image
          source={{ uri: process.env.EXPO_PUBLIC_FOLDER_URL + '/' + product.icon }}
          style={{ width: 100, height: 100, marginBottom: 10, alignSelf: 'center' }}
        />
        <Button
          onPress={handlePurchase}
          loading={purchaseMutation.isLoading}
          disabled={character.berries < product.price}
        >
          {({ color }) => (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
              <Text style={{ color }}>{product.price}</Text>
              <BerryIcon />
            </View>
          )}
        </Button>
      </View>
    </Overlay>
  )
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
  },
})

export default ProductOverlay
