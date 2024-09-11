import { ShopCategory } from '@world-of-studies/api-types/src/shop/shop_category'
import { Product } from '@world-of-studies/api-types/src/shop/shop_product'
import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import { View, FlatList, StyleSheet } from 'react-native'

import ProductItem from '@/components/product-card'
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
  category: ShopCategory
  onProductPress: (product: Product) => void
}

const CategoryItem: React.FC<Props> = ({ category, onProductPress }) => {
  return (
    <View style={styles.categoryContainer}>
      <LinearGradient colors={settings.title.container1} style={styles.container1}>
        <LinearGradient colors={settings.title.container2} style={styles.container2}>
          <Text style={styles.categoryTitle}>{category.name}</Text>
        </LinearGradient>
      </LinearGradient>
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
  container1: {
    borderRadius: 15,
    paddingVertical: 5,
    marginHorizontal: 10,

    marginBottom: 8,
  },
  container2: {
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
})

export default CategoryItem
