import FontAwesome from '@expo/vector-icons/FontAwesome'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { Redirect, Tabs } from 'expo-router'
import { useAtom } from 'jotai'
import React, { useCallback, useRef } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

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
          tabBarActiveTintColor: 'blue',
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
            title: 'Shop',
            tabBarIcon: ({ color }) => <FontAwesome size={28} name="shopping-cart" color={color} />,
          }}
        />
        {/* Home Tab */}
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
          }}
        />
        {/* Exercises Tab */}
        <Tabs.Screen
          name="exercices"
          options={{
            title: 'Exercises',
            tabBarIcon: ({ color }) => <FontAwesome size={28} name="pencil" color={color} />,
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
