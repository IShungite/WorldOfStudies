import { Product } from '@world-of-studies/api-types/src/shop/shop_product' // Adjust import if necessary
import React from 'react'
import { TouchableOpacity, StyleSheet, View, Image } from 'react-native'

import Text from '@/components/shared/Text'

const settings = {
  title: {
    container1: ['#b1cae8', '#26506d'],
    container2: ['#5f92cf', '#346b9a'],
  },
  content: {
    backgroundColor: '#2e424f',
  },
  border: {
    color: '#11181c',
    width: 4,
  },
}

type Props = {
  product: Product
  onPress: () => void
}

const ProductItem: React.FC<Props> = ({ product, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <Text style={styles.productName}>{product.name}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.productPrice}>{product.price}</Text>
          <Image source={require('../assets/images/berry_small.webp')} style={styles.image} />
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 140,
    paddingHorizontal: 5,
    paddingVertical: 10,

    borderWidth: settings.border.width,
    borderRadius: 8,
    borderColor: settings.border.color,

    backgroundColor: settings.content.backgroundColor,
  },
  productName: {
    color: '#fff',
    textAlign: 'center',
    marginBottom: 15,
    fontSize: 20,
  },
  productPrice: {
    color: '#fff',
    textAlign: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  image: {
    width: 24,
    height: 24,
  },
})

export default ProductItem
