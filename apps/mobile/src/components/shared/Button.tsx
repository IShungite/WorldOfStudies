import React, { useState } from 'react'
import { StyleSheet, Pressable, View, ActivityIndicator, StyleProp, ViewStyle } from 'react-native'

import GradientContainer from '@/components/shared/GradientContainer'
import Text from '@/components/shared/Text'

const colors = {
  orange: {
    notPressed: {
      container1: ['#fae6b3', '#b2772c'],
      container2: ['#f4c761', '#e6a23c'],
      text: '#583a14',
    },
    pressed: {
      container1: ['#e6d09f', '#a06d27'],
      container2: ['#dcb357', '#cf9136'],
      text: '#3d2805',
    },
  },
  gray: {
    notPressed: {
      container1: ['#deeffa', '#7092a2'],
      container2: ['#baddf3', '#93c1d9'],
      text: '#2e3d43',
    },
    pressed: {
      container1: ['#c9d9e2', '#5d7a85'],
      container2: ['#9bc5d8', '#7ba6b6'],
      text: '#1e2c32',
    },
  },
  green: {
    notPressed: {
      container1: ['#abdbce', '#116d5b'],
      container2: ['#1ab99a', '#16a085'],
      text: '#0a3a31',
    },
    pressed: {
      container1: ['#91c7b8', '#0e5a4b'],
      container2: ['#159a83', '#12866f'],
      text: '#06342b',
    },
  },
  pink: {
    notPressed: {
      container1: ['#f5bfe9', '#b2449d'],
      container2: ['#ea7bd3', '#ea55c5'],
      text: '#531f49',
    },
    pressed: {
      container1: ['#e0aad5', '#943a82'],
      container2: ['#d263bb', '#c84daa'],
      text: '#3e1735',
    },
  },
  red: {
    notPressed: {
      container1: ['#f7b3b3', '#a83232'],
      container2: ['#ec7070', '#d94545'],
      text: '#5a2b2b',
    },
    pressed: {
      container1: ['#dfa4a4', '#942828'],
      container2: ['#e06060', '#b83636'],
      text: '#461f1f',
    },
  },
}

const Button = ({
  title,
  onPress,
  color = 'gray',
  loading = false,
  style,
  children,
  disabled = false,
}: {
  title?: string
  onPress: () => void
  color?: keyof typeof colors
  loading?: boolean
  disabled?: boolean
  children?: React.ReactNode | ((props: { color: string }) => React.ReactNode)
  style?: StyleProp<ViewStyle>
}) => {
  const [isPressed, setIsPressed] = useState(false)
  const colorsToUse = colors[color][isPressed ? 'pressed' : 'notPressed']

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loaderContainer}>
          <ActivityIndicator color={colorsToUse.text} size={13} />
          <Text style={[styles.loaderText, { color: colorsToUse.text }]}>Loading...</Text>
        </View>
      )
    }

    if (disabled) {
    }

    if (children) {
      return typeof children === 'function' ? children({ color: colorsToUse.text }) : children
    }

    return <Text style={[{ color: colorsToUse.text, textAlign: 'center' }]}>{title}</Text>
  }

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      disabled={loading || disabled}
      style={style}
    >
      <GradientContainer
        outerColors={colorsToUse.container1}
        innerColors={colorsToUse.container2}
        outerStyle={styles.container1}
        innerStyle={styles.container2}
      >
        {renderContent()}
      </GradientContainer>
      <View
        style={{
          backgroundColor: '#000',
          borderRadius: 8,
          opacity: 0.4,
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        }}
      />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container1: {
    borderRadius: 8,
    paddingTop: 3,
    paddingBottom: 6,
  },
  container2: {
    borderRadius: 9,
    padding: 10,
  },
  loaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderText: {
    marginLeft: 6,
  },
  disabledText: {
    color: '#999',
    textAlign: 'center',
  },
})

export default Button
