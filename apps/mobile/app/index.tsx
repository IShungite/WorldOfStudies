import React from 'react'
import { SafeAreaView, StyleSheet } from 'react-native'

import SignUpScreen from '../screens/SignUpScreen'

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <SignUpScreen />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
})

export default App
