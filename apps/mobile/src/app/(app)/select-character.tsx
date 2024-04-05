import { Redirect } from 'expo-router'
import React from 'react'
import { Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const characters = [
  {
    name: 'Hello',
  },
  {
    name: 'Hello2',
  },
]

export default function SelectCharacter() {
  if (characters.length === 0) {
    return <Redirect href="/create-character" />
  }

  return (
    <SafeAreaView>
      <Text>Select Char</Text>
    </SafeAreaView>
  )
}
