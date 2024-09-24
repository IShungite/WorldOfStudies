import { Button } from '@rneui/themed'
import { ShopCategory, Product, ShopResponse } from '@world-of-studies/api-types/src/shop'
import { useAtom } from 'jotai'
import React, { useState } from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import { useQuery } from 'react-query'

import kyInstance from '@/api/kyInstance'
import CategoryItem from '@/components/category-item'
import ProductOverlay from '@/components/product-overlay'
import { selectedCharacterAtom } from '@/providers/selected-character'

const ShopScreen = () => {
  const [selectedCharacter] = useAtom(selectedCharacterAtom)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [overlayVisible, setOverlayVisible] = useState(false)

  const {
    data: categories,
    isLoading: isCategoriesLoading,
    error,
  } = useQuery<ShopCategory[]>(
    ['shopCategories', selectedCharacter?.schoolId],
    async (): Promise<ShopCategory[]> => {
      if (!selectedCharacter?.schoolId) {
        throw new Error('No school ID found')
      }
      const response = await kyInstance.get(`schools/${selectedCharacter.schoolId}/shop`)
      return ((await response.json()) as ShopResponse).categories
    },
    {
      enabled: !!selectedCharacter?.schoolId,
    }
  )

  const showOverlay = (product: Product) => {
    setSelectedProduct(product)
    setOverlayVisible(true)
  }

  const closeOverlay = () => {
    setOverlayVisible(false)
  }

  if (!selectedCharacter) {
    return (
      <View style={styles.centered}>
        <Text>Character not selected</Text>
      </View>
    )
  }

  if (isCategoriesLoading) {
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
    <ScrollView style={{ marginTop: 5 }}>
      {categories.map((category) => (
        <CategoryItem key={category.id} category={category} onProductPress={showOverlay} />
      ))}
      {selectedProduct && (
        <ProductOverlay
          product={selectedProduct}
          character={selectedCharacter}
          isVisible={overlayVisible}
          onClose={closeOverlay}
          onBackdropPress={closeOverlay}
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
