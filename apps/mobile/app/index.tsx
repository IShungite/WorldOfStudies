import React from 'react'
import { SafeAreaView, StyleSheet } from 'react-native'
import { QueryClient, QueryClientProvider } from 'react-query'

import SignUpScreen from '../screens/SignUpScreen'

const queryClient = new QueryClient()

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaView style={styles.container}>
        <SignUpScreen />
      </SafeAreaView>
    </QueryClientProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
})

export default App
