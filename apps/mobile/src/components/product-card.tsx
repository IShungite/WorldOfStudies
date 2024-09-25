import { Product } from '@world-of-studies/api-types/src/shop/shop_product' // Adjust import if necessary
import React from 'react'
import { TouchableOpacity, StyleSheet, View, Image } from 'react-native'

import BerryIcon from '@/components/shared/BerryIcon'
import Container from '@/components/shared/Container'
import Text from '@/components/shared/Text'

type Props = {
  product: Product
  onPress: () => void
}

const ProductItem: React.FC<Props> = ({ product, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Container>
        <Text style={styles.productName}>{product.name}</Text>
        <Image
          source={{ uri: process.env.EXPO_PUBLIC_FOLDER_URL + '/' + product.icon }}
          style={{ width: 50, height: 50, alignSelf: 'center' }}
        />
        <View style={styles.priceContainer}>
          <Text style={styles.productPrice}>{product.price}</Text>
          <BerryIcon size={24} />
        </View>
      </Container>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 140,
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
    paddingTop: 10,
  },
})

export default ProductItem
