import FontAwesome from '@expo/vector-icons/FontAwesome'
import { Redirect, Tabs } from 'expo-router'
import React from 'react'
import { Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: { name: React.ComponentProps<typeof FontAwesome>['name']; color: string }) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />
}

const selectedCharacter = null

export default function TabLayout() {
  if (!selectedCharacter) {
    return <Redirect href="/select-character" />
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        header: ({ options }) => (
          <SafeAreaView style={{ backgroundColor: '#7AAD84' }}>
            <Text>{options.title}</Text>
          </SafeAreaView>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Tab One',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
        }}
      />
      <Tabs.Screen
        name="statistics"
        options={{
          title: 'Tab Two',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
        }}
      />
    </Tabs>
  )
}
