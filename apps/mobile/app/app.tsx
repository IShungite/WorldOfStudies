import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React, { Suspense } from 'react'
import { ActivityIndicator, SafeAreaView, StyleSheet } from 'react-native'
import { QueryClient, QueryClientProvider } from 'react-query'

import '../i18n/i18n'

import LogInScreen from '../screens/LogInScreen'
import SignUpScreen from '../screens/SignUpScreen'

const queryClient = new QueryClient()
const Stack = createNativeStackNavigator()

const App = () => {
  return (
    <Suspense fallback={<ActivityIndicator size="large" />}>
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
    </Suspense>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
})

export default App
