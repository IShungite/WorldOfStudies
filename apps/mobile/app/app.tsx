import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React, { Suspense } from 'react'
import { ActivityIndicator, SafeAreaView, StyleSheet } from 'react-native'
import { QueryClient, QueryClientProvider } from 'react-query'

import '../i18n/i18n'

import HomeScreen from '../screens/HomeScreen'
import LogInScreen from '../screens/LogInScreen'
import RegisterScreen from '../screens/RegisterScreen'

const queryClient = new QueryClient()
const Stack = createNativeStackNavigator()

const App = () => {
  return (
    <Suspense fallback={<ActivityIndicator size="large" />}>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <SafeAreaView style={styles.container}>
            <Stack.Navigator initialRouteName="Register">
              <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Register' }} />
              <Stack.Screen name="LogIn" component={LogInScreen} options={{ title: 'Log In' }} />
              <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
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
