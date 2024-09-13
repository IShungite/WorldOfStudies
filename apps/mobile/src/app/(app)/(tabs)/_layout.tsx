import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { Redirect, Tabs } from 'expo-router'
import { useAtom } from 'jotai'
import React, { useCallback, useRef } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import TabIcon from '@/components/TabIcon'
import Header from '@/components/header'
import SelectCharacter from '@/components/selectCharacter'
import { selectedCharacterAtom } from '@/providers/selected-character'

export default function TabLayout() {
  const [selectedCharacterResponse] = useAtom(selectedCharacterAtom)
  const selectedCharacter = selectedCharacterResponse || null

  // ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null)

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present()
  }, [])

  if (!selectedCharacter) {
    return <Redirect href="/login" />
  }

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: true,
          header: ({ options }) => (
            <SafeAreaView>
              <Header character={selectedCharacter} onClick={handlePresentModalPress} />
            </SafeAreaView>
          ),
        }}
      >
        {/* Shop Tab */}
        <Tabs.Screen
          name="shop"
          options={{
            tabBarLabel: () => {
              return null
            },
            tabBarIcon: ({ focused }) => (
              <TabIcon isSelected={focused} icon={require(`@/assets/images/tabs/shop.webp`)} label="Shop" />
            ),
          }}
        />
        {/* Home Tab */}
        <Tabs.Screen
          name="index"
          options={{
            tabBarLabel: () => {
              return null
            },
            tabBarIcon: ({ focused }) => (
              <TabIcon isSelected={focused} icon={require(`@/assets/images/tabs/home.webp`)} label="Home" />
            ),
          }}
        />
        {/* Exercises Tab */}
        <Tabs.Screen
          name="exercices"
          options={{
            tabBarLabel: () => {
              return null
            },
            tabBarIcon: ({ focused }) => (
              <TabIcon isSelected={focused} icon={require(`@/assets/images/tabs/exercices.webp`)} label="Exercises" />
            ),
          }}
        />
        {/* Statistics Tab */}
        <Tabs.Screen
          name="statistics"
          options={{
            title: 'Statistics',
            // hidden tab
            href: null,
          }}
        />
      </Tabs>
      <SelectCharacter sheetRef={bottomSheetModalRef} />
    </>
  )
}
