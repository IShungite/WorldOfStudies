import { Overlay } from '@rneui/themed'
import { Product } from '@world-of-studies/api-types/src/shop/shop_product'
import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

import Button from '@/components/shared/Button'

type Props = {
  isVisible: boolean
  onBackdropPress: () => void
  product: Product
  onPurchase: () => void
}

const ProductOverlay: React.FC<Props> = ({ isVisible, onBackdropPress, product, onPurchase }) => {
  return (
    <Overlay isVisible={isVisible} onBackdropPress={onBackdropPress} overlayStyle={styles.overlay}>
      <View style={styles.content}>
        <Text style={styles.title}>{product.name}</Text>
        <Button title={`Buy for $${product.price}`} onPress={onPurchase} />
      </View>
    </Overlay>
  )
}

const styles = StyleSheet.create({
  overlay: {
    width: '90%',
    padding: 20,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
})

export default ProductOverlay
