import { ShopCategory } from '@world-of-studies/api-types/src/shop/shop_category'
import { Product } from '@world-of-studies/api-types/src/shop/shop_product'
import React from 'react'
import { View, FlatList, StyleSheet } from 'react-native'

import ProductItem from '@/components/product-card'
import GradientContainer from '@/components/shared/GradientContainer'
import Text from '@/components/shared/Text'

type Props = {
  category: ShopCategory
  onProductPress: (product: Product) => void
}

const CategoryItem: React.FC<Props> = ({ category, onProductPress }) => {
  return (
    <View style={styles.categoryContainer}>
      <GradientContainer style={styles.gradientContainer}>
        <Text style={styles.categoryTitle}>{category.name}</Text>
      </GradientContainer>
      <FlatList
        data={category.products}
        renderItem={({ item }) => <ProductItem product={item} onPress={() => onProductPress(item)} />}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.productList}
        ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  categoryContainer: {
    marginBottom: 20,
  },
  categoryTitle: {
    textAlign: 'center',
    color: '#fff',
    letterSpacing: 2,
    fontSize: 25,
  },
  productList: {
    paddingHorizontal: 10,
  },
  gradientContainer: {
    marginHorizontal: 10,
    marginBottom: 8,
  },
})

export default CategoryItem
