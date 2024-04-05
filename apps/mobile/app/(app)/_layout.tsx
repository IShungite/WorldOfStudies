import FontAwesome from '@expo/vector-icons/FontAwesome'
import { Link, Tabs, Redirect } from 'expo-router'
import React from 'react'
import { Pressable, Text } from 'react-native'

import { useSession } from '@/providers/session.provider'

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: { name: React.ComponentProps<typeof FontAwesome>['name']; color: string }) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />
}

export default function TabLayout() {
  const { session, isLoading } = useSession()

  if (isLoading) {
    return <Text>Loading....</Text>
  }

  if (!session) {
    return <Redirect href="login" />
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Tab One',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
        }}
      />
    </Tabs>
  )
}
