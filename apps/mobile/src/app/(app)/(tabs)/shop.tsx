import { ShopCategory, Product, ShopResponse } from '@world-of-studies/api-types/src/shop'
import { useAtom } from 'jotai'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View, ScrollView, StyleSheet } from 'react-native'
import { useQuery } from 'react-query'

import kyInstance from '@/api/kyInstance'
import CategoryItem from '@/components/category-item'
import ProductOverlay from '@/components/product-overlay'
import BerryIcon from '@/components/shared/BerryIcon'
import GradientContainer from '@/components/shared/GradientContainer'
import PageLoader from '@/components/shared/PageLoader'
import Text from '@/components/shared/Text'
import { selectedCharacterAtom } from '@/providers/selected-character'

const ShopScreen = () => {
  const [selectedCharacter] = useAtom(selectedCharacterAtom)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [overlayVisible, setOverlayVisible] = useState(false)
  const { t } = useTranslation()

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
    return <PageLoader />
  }

  if (error || !categories) {
    return (
      <View style={styles.centered}>
        <Text>Failed to load data</Text>
      </View>
    )
  }

  return (
    <>
      <GradientContainer style={styles.gradientContainer}>
        <View style={styles.priceContainer}>
          <Text style={styles.categoryTitle}>
            {t('current_balance')} : {selectedCharacter.berries}
          </Text>
          <BerryIcon size={24} />
        </View>
      </GradientContainer>
      <ScrollView style={{ marginTop: 5 }}>
        {categories.map((category) => (
          <CategoryItem key={category.id} category={category} onProductPress={showOverlay} />
        ))}
        {selectedProduct && (
          <ProductOverlay
            product={selectedProduct}
            character={selectedCharacter}
            isVisible={overlayVisible}
            onPurchase={closeOverlay}
            onBackdropPress={closeOverlay}
          />
        )}
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientContainer: {
    marginHorizontal: 10,
    marginBottom: 8,
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryTitle: {
    textAlign: 'center',
    color: '#fff',
    letterSpacing: 2,
    fontSize: 25,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
})

export default ShopScreen
