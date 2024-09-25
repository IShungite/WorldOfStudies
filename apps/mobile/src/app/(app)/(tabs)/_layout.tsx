import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { Redirect, Tabs } from 'expo-router'
import { useAtom } from 'jotai'
import React, { useCallback, useRef } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import TabIcon from '@/components/TabIcon'
import Header from '@/components/header'
import SelectCharacter from '@/components/selectCharacter'
import { selectedCharacterAtom } from '@/providers/selected-character'

const tabBarLabel = () => {
  return null
}

export default function TabLayout() {
  const [selectedCharacterResponse] = useAtom(selectedCharacterAtom)
  const selectedCharacter = selectedCharacterResponse || null

  const bottomSheetModalRef = useRef<BottomSheetModal>(null)

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
          header: () => (
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
            tabBarLabel,
            tabBarIcon: ({ focused }) => (
              <TabIcon
                isSelected={focused}
                icon={require(`@/assets/images/tabs/shop.webp`)}
                label="Shop"
                withBorderLeft={false}
              />
            ),
          }}
        />
        {/* Home Tab */}
        <Tabs.Screen
          name="index"
          options={{
            tabBarLabel,
            tabBarIcon: ({ focused }) => (
              <TabIcon isSelected={focused} icon={require(`@/assets/images/tabs/home.webp`)} label="Home" />
            ),
          }}
        />
        {/* Exercises Tab */}
        <Tabs.Screen
          name="exercices"
          options={{
            tabBarLabel,
            tabBarIcon: ({ focused }) => (
              <TabIcon isSelected={focused} icon={require(`@/assets/images/tabs/exercices.webp`)} label="Exercises" />
            ),
          }}
        />
        {/* Statistics Tab */}
        <Tabs.Screen
          name="statistics"
          options={{
            tabBarLabel,
            tabBarIcon: ({ focused }) => (
              <TabIcon
                isSelected={focused}
                icon={require(`@/assets/images/tabs/statistics.webp`)}
                label="Statistiques"
                withBorderRight={false}
              />
            ),
          }}
        />
        {/* Profile Tab */}
        <Tabs.Screen
          name="profile"
          options={{
            tabBarLabel,
            tabBarIcon: ({ focused }) => (
              <TabIcon
                isSelected={focused}
                icon={require(`@/assets/images/tabs/profile.png`)}
                label="Profile"
                withBorderRight={false}
              />
            ),
          }}
        />
      </Tabs>
      <SelectCharacter sheetRef={bottomSheetModalRef} />
    </>
  )
}
