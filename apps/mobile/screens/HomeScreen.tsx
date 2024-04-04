import React from 'react'
import { Animated, StyleSheet, View } from 'react-native'

import Text = Animated.Text

const LogInScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Home</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
})

export default LogInScreen
