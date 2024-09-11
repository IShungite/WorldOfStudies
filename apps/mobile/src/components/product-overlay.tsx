import { Product } from '@world-of-studies/api-types/src/shop/shop_product'
import React from 'react'
import { View, StyleSheet, Image } from 'react-native'

import BerryIcon from '@/components/shared/BerryIcon'
import Button from '@/components/shared/Button'
import Overlay from '@/components/shared/Overlay'
import Text from '@/components/shared/Text'

type Props = {
  isVisible: boolean
  onBackdropPress: () => void
  product: Product
  onPurchase: () => void
}

const ProductOverlay: React.FC<Props> = ({ isVisible, onBackdropPress, product, onPurchase }) => {
  return (
    <Overlay isVisible={isVisible} onBackdropPress={onBackdropPress} title={product.name}>
      <View style={styles.content}>
        <Button onPress={onPurchase}>
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
