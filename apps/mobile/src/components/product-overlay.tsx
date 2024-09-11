import { Product } from '@world-of-studies/api-types/src/shop/shop_product'
import React from 'react'
import { View, StyleSheet } from 'react-native'

import Button from '@/components/shared/Button'
import Overlay from '@/components/shared/Overlay'

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
        <Button title={`Buy for $${product.price}`} onPress={onPurchase} />
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
