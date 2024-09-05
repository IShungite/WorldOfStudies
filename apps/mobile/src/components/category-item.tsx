import { ShopCategory } from '@world-of-studies/api-types/src/shop/shop_category'
import { Product } from '@world-of-studies/api-types/src/shop/shop_product'
import React from 'react'
import { View, Text, FlatList, StyleSheet } from 'react-native'

import ProductItem from '@/components/product-card'

type Props = {
  category: ShopCategory
  onProductPress: (product: Product) => void
}

const CategoryItem: React.FC<Props> = ({ category, onProductPress }) => {
  return (
    <View style={styles.categoryContainer}>
      <Text style={styles.categoryTitle}>{category.name}</Text>
      <FlatList
        data={category.products}
        renderItem={({ item }) => <ProductItem product={item} onPress={() => onProductPress(item)} />}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.productList}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  categoryContainer: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    padding: 10,
    color: '#333',
    backgroundColor: '#f8f8f8',
    textAlign: 'center',
  },
  productList: {
    paddingHorizontal: 10,
  },
})

export default CategoryItem
