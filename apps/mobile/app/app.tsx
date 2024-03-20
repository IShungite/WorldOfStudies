import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import { SafeAreaView, StyleSheet } from 'react-native'
import { QueryClient, QueryClientProvider } from 'react-query'

// Import your screens
import LogInScreen from '../screens/LogInScreen' // Ensure you have this screen created
import SignUpScreen from '../screens/SignUpScreen'

const queryClient = new QueryClient()
const Stack = createNativeStackNavigator()

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <SafeAreaView style={styles.container}>
          <Stack.Navigator initialRouteName="SignUp">
            <Stack.Screen name="SignUp" component={SignUpScreen} options={{ title: 'Sign Up' }} />
            <Stack.Screen name="LogIn" component={LogInScreen} options={{ title: 'Log In' }} />
          </Stack.Navigator>
        </SafeAreaView>
      </NavigationContainer>
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
