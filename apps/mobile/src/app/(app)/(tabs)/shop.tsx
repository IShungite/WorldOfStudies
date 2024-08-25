import { Button } from '@rneui/themed'
import { ShopCategory } from '@world-of-studies/api-types/src/shop/shop_category'
import { Product } from '@world-of-studies/api-types/src/shop/shop_product'
import { ShopResponse } from '@world-of-studies/api-types/src/shop/shop_response'
import React, { useState } from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import { useQuery } from 'react-query'

import kyInstance from '@/api/kyInstance'
import CategoryItem from '@/components/category-item'
import ProductOverlay from '@/components/product-overlay'
import { useMyCharacters } from '@/hooks/useMyCharacters'
import { usePurchaseProduct } from '@/hooks/usePurchaseProduct'

const ShopScreen = () => {
  const { data: characters, isLoading: isCharactersLoading } = useMyCharacters()
  const purchaseMutation = usePurchaseProduct()
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null) // Ensure initial state is null for Product type
  const [overlayVisible, setOverlayVisible] = useState(false)

  const {
    data: categories,
    isLoading: isCategoriesLoading,
    error,
  } = useQuery<ShopCategory[]>(['shopCategories', characters?.[0]?.schoolId], async () => {
    if (!characters || characters.length === 0 || !characters[0]?.schoolId) {
      throw new Error('No school ID found')
    }
    const response = await kyInstance.get(`schools/${characters[0].schoolId}/shop`)
    const data = (await response.json()) as ShopResponse
    return data.categories
  })

  const showOverlay = (product: Product) => {
    setSelectedProduct(product)
    setOverlayVisible(true)
  }

  const handlePurchase = () => {
    if (selectedProduct && characters?.[0]) {
      purchaseMutation.mutate({
        shopId: characters[0].schoolId,
        productId: selectedProduct.id,
        characterId: characters[0].id,
      })
      setOverlayVisible(false)
    }
  }

  if (isCharactersLoading || isCategoriesLoading) {
    return (
      <View style={styles.centered}>
        <Button title="Loading" loading />
      </View>
    )
  }

  if (error || !categories) {
    return (
      <View style={styles.centered}>
        <Text>Failed to load data</Text>
      </View>
    )
  }

  return (
    <ScrollView>
      {categories.map((category) => (
        <CategoryItem key={category.id} category={category} onProductPress={showOverlay} />
      ))}
      {selectedProduct && (
        <ProductOverlay
          product={selectedProduct}
          isVisible={overlayVisible}
          onBackdropPress={() => setOverlayVisible(false)}
          onPurchase={handlePurchase}
        />
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default ShopScreen
