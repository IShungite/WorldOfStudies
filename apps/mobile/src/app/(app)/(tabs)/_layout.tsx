import FontAwesome from '@expo/vector-icons/FontAwesome'
import { Redirect, Tabs } from 'expo-router'
import { useAtom } from 'jotai'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import Header from '@/components/header'
import { selectedCharacterAtom } from '@/providers/selected-character'

export default function TabLayout() {
  const [selectedCharacter] = useAtom(selectedCharacterAtom)

  if (!selectedCharacter) {
    return <Redirect href="/login" />
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'blue',
        headerShown: true,
        header: ({ options }) => (
          <SafeAreaView>
            <Header character={selectedCharacter} />
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
          // hidden tab
          href: null,
        }}
      />
    </Tabs>
  )
}
