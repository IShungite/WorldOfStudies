import { Card } from '@rneui/themed'
import { Product } from '@world-of-studies/api-types/src/shop/shop_product'
import React from 'react'
import { TouchableOpacity, Text } from 'react-native'

type Props = {
  product: Product
}

const ProductItem: React.FC<Props> = ({ product }) => {
  return (
    <TouchableOpacity>
      <Card containerStyle={{ width: 140, marginRight: 10 }}>
        <Card.Title>{product.name}</Card.Title>
        <Card.Divider />
        <Text>Price: ${product.price}</Text>
      </Card>
    </TouchableOpacity>
  )
}

export default ProductItem
