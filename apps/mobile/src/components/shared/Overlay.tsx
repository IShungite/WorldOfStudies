import { OverlayProps, Overlay as OverlayRne } from '@rneui/themed'
import React from 'react'
import { StyleSheet, View } from 'react-native'

import GradientContainer from '@/components/shared/GradientContainer'
import Text from '@/components/shared/Text'

const settings = {
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
    <OverlayRne {...props} overlayStyle={{ padding: 0, elevation: 0, backgroundColor: 'transparent' }}>
      <View style={{ alignItems: 'center' }}>
        <View style={styles.title}>
          <GradientContainer
            style={styles.gradientContainer}
            outerStyle={{ borderRadius: 3, paddingVertical: 3 }}
            innerStyle={{ borderRadius: 5, paddingVertical: 5 }}
          >
            <Text style={styles.titleText}>{title}</Text>
          </GradientContainer>
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
  gradientContainer: {
    borderRadius: 3,
  },
  titleText: {
    textAlign: 'center',
    color: '#fff',
    letterSpacing: 2,
    fontSize: 25,
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
