import { Feather } from '@expo/vector-icons'
import { Avatar } from '@rneui/themed'
import { Character } from '@world-of-studies/api-types/src/character/character'
import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'

import Text from '@/components/shared/Text'

type Props = {
  character: Character
  onClick: () => void
}

export default function Header({ character, onClick }: Props) {
  return (
    <View style={styles.container1}>
      <View style={styles.container2}>
        <TouchableOpacity
          onPress={onClick}
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <View style={styles.characterContainer}>
            <Avatar
              containerStyle={styles.avatarContainer}
              source={require('../assets/images/avatars/avatar1.webp')}
              avatarStyle={styles.avatar}
            />
            <View style={styles.characterInfoContainer}>
              <View style={{ gap: 2 }}>
                <Text style={{ fontSize: 16, color: '#465268' }}>{character.name}</Text>
                <Text style={{ fontSize: 12, color: '#54627e' }}>2021-2022</Text>
              </View>
              <Feather name="code" size={24} color="#373e4d" style={{ transform: [{ rotateZ: '90deg' }] }} />
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <View style={styles.moreButton}>
            <Feather name="more-vertical" size={24} color="#373e4d" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const avatarSize = 40
const avatarBorderRadius = 50

const styles = StyleSheet.create({
  container1: {
    paddingHorizontal: 10,
    paddingVertical: 5,

    backgroundColor: '#8594b2',
  },
  container2: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    gap: 10,
  },
  avatarContainer: {
    borderColor: '#373e4d',
    borderWidth: 1,
    borderRadius: avatarBorderRadius,
    width: avatarSize,
    height: avatarSize,
  },
  avatar: {
    width: avatarSize,
    height: avatarSize,
    borderRadius: avatarBorderRadius,
  },
  moreButton: {
    padding: 5,
    borderRadius: 50,
    backgroundColor: '#bfd4ff',
  },
  characterContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    backgroundColor: 'rgba(191, 212, 255, 1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  characterInfoContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
})
