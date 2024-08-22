import { Button } from '@rneui/themed'
import { ShopResponse } from '@world-of-studies/api-types'
import { ShopCategory } from '@world-of-studies/api-types/src/shop/shop_category'
import React from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import { useQuery } from 'react-query'

import kyInstance from '@/api/kyInstance'
import CategoryItem from '@/components/category-item'
import { useMyCharacters } from '@/hooks/useMyCharacters'

const ShopScreen = () => {
  const { data: characters, isLoading: isCharactersLoading } = useMyCharacters()

  const {
    data: categories,
    isLoading: isCategoriesLoading,
    error,
  } = useQuery<ShopCategory[]>(['shopCategories', characters?.[0]?.schoolId], async () => {
    if (!characters || characters.length === 0 || !characters[0].schoolId) {
      throw new Error('No school ID found')
    }
    const response = (await kyInstance.get(`schools/${characters[0].schoolId}/shop`).json()) as ShopResponse
    return response.categories
  })

  if (isCharactersLoading || isCategoriesLoading) {
    return (
      <View style={styles.centered}>
        <Button title="Spinner" type="clear" loading />
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
        <CategoryItem key={category.id} category={category} />
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
})

export default ShopScreen
