import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import { StyleSheet, ViewStyle } from 'react-native'

type Props = {
  children: React.ReactNode
  outerColors?: string[]
  innerColors?: string[]
  style?: ViewStyle
  outerStyle?: ViewStyle
  innerStyle?: ViewStyle
}

const defaultColors = {
  outer: ['#b1cae8', '#26506d'],
  inner: ['#5f92cf', '#346b9a'],
}

const GradientContainer: React.FC<Props> = ({
  children,
  outerColors = defaultColors.outer,
  innerColors = defaultColors.inner,
  outerStyle = {},
  innerStyle = {},
  style,
}) => {
  return (
    <LinearGradient colors={outerColors} style={[styles.container1, style, outerStyle]}>
      <LinearGradient colors={innerColors} style={[styles.container2, innerStyle]}>
        {children}
      </LinearGradient>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container1: {
    borderRadius: 15,
    paddingVertical: 5,
    paddingTop: 3,
    paddingBottom: 5,
  },
  container2: {
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
})

export default GradientContainer
