import { OverlayProps, Overlay as OverlayRne } from '@rneui/themed'
import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import { StyleSheet, View } from 'react-native'

import Text from '@/components/shared/Text'

const settings = {
  title: {
    container1: ['#b1cae8', '#26506d'],
    container2: ['#5f92cf', '#346b9a'],
  },
  content: {
    backgroundColor: '#2e424f',
  },
  border: {
    color: '#11181c',
    width: 4,
  },
}

type Props = OverlayProps & {
  title: string
}

const Overlay = ({ children, title, ...props }: Props) => {
  return (
    <OverlayRne
      {...props}
      overlayStyle={{ padding: 0, elevation: 0, shadowOpacity: 0, backgroundColor: 'transparent' }}
    >
      <View style={{ alignItems: 'center' }}>
        <View style={styles.title}>
          <LinearGradient colors={settings.title.container1} style={styles.container1}>
            <LinearGradient colors={settings.title.container2} style={styles.container2}>
              <Text style={styles.titleText}>{title}</Text>
            </LinearGradient>
          </LinearGradient>
        </View>
        <View style={styles.content}>{children}</View>
      </View>
    </OverlayRne>
  )
}

const styles = StyleSheet.create({
  title: {
    borderColor: settings.border.color,
    borderWidth: settings.border.width,
    borderRadius: 8,
    width: '120%',
  },
  titleText: {
    textAlign: 'center',
    color: '#fff',
    letterSpacing: 2,
    fontSize: 25,
  },
  container1: {
    borderRadius: 3,
    paddingVertical: 3,
  },
  container2: {
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  content: {
    marginTop: -settings.border.width,

    borderWidth: settings.border.width,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderColor: settings.border.color,

    backgroundColor: settings.content.backgroundColor,
    padding: 20,
  },
})

export default Overlay
