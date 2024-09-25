import React from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'

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

type Props = {
  title: string
  children?: React.ReactNode
  containerStyle?: ViewStyle
}

const Card = ({ title, children, containerStyle }: Props) => {
  return (
    <View style={[{ alignItems: 'center' }, containerStyle]}>
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
  )
}

const styles = StyleSheet.create({
  title: {
    borderColor: settings.border.color,
    borderWidth: settings.border.width,
    borderRadius: 8,
    width: '115%',
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
    width: '100%',
    marginTop: -settings.border.width,
    borderWidth: settings.border.width,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderColor: settings.border.color,
    backgroundColor: settings.content.backgroundColor,
    padding: 20,
  },
})

export default Card
