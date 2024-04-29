import { Feather } from '@expo/vector-icons'
import { Avatar, Button } from '@rneui/themed'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

type Props = {
  character: {
    name: string
  }
}

export default function Header({ character }: Props) {
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 5,
      }}
    >
      <TouchableOpacity
        onPress={() => alert('hello')}
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <Avatar size={40} containerStyle={{ backgroundColor: '#ACA5A4' }} />
        <View>
          <Text>{character.name}</Text>
          <Text>2021-2022</Text>
        </View>
        <Feather name="code" size={24} color="black" style={{ transform: [{ rotateZ: '90deg' }] }} />
      </TouchableOpacity>
      <Button buttonStyle={{ borderRadius: 50 }} type="outline">
        <Feather name="more-vertical" size={24} color="black" />
      </Button>
    </View>
  )
}