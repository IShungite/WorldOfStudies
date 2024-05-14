import { Button, Card } from '@rneui/themed'
import React from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, FlatList } from 'react-native'
import { useQuery } from 'react-query'

import kyInstance from '@/api/kyInstance'
import { Category, Product, ShopResponse } from '@/utils/types'

const ProductItem = ({ product }: { product: Product }) => {
  return (
    <TouchableOpacity
      onPress={() => {
        /* TODO: add details on click */
      }}
    >
      <Card containerStyle={styles.productCard}>
        <Card.Title>{product.name}</Card.Title>
        <Card.Divider />
        <Text>Price: ${product.price}</Text>
      </Card>
    </TouchableOpacity>
  )
}

const ShopScreen = () => {
  const {
    data: shop,
    isLoading,
    error,
  } = useQuery<Category[]>('shopCategories', async () => {
    const response = (await kyInstance.get('schools/7455/shop').json()) as ShopResponse
    return response.categories
  })

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <Button title="Loading" type="solid" loading />
      </View>
    )
  }

  if (error || !shop) {
    return (
      <View style={styles.centered}>
        <Text>Failed to load data</Text>
      </View>
    )
  }

  return (
    <ScrollView>
      {shop.map((category) => (
        <View key={category.id} style={styles.categoryContainer}>
          <Text style={styles.categoryTitle}>{category.name}</Text>
          <FlatList
            data={category.products}
            renderItem={({ item }) => <ProductItem product={item} />}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productList}
          />
        </View>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
  productCard: {
    width: 140,
    marginRight: 10,
  },
})

export default ShopScreen
