import React, { useState } from 'react'
import { View, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native'
import { useMutation } from 'react-query'

import axiosInstance from '../api/axiosInstance' // Ensure this is correctly set up to point to your API

const LogInScreen = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const loginMutation = useMutation(
    async (loginData: { email: string; password: string }) => {
      return axiosInstance.post('/auth/login', loginData)
    },
    {
      onSuccess: (data) => {
        console.log(data) // Placeholder: Save the token, navigate, etc.
      },
      onError: (error) => {
        Alert.alert('Login failed', 'Please check your credentials and try again.')
        console.error(error)
      },
      onSettled: () => {
        setIsLoading(false)
      },
    }
  )

  const handleSubmit = () => {
    setIsLoading(true)
    loginMutation.mutate({ email, password })
  }

  if (isLoading) {
    return <ActivityIndicator size="large" />
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />
      <Button title="Login" onPress={handleSubmit} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    marginBottom: 12,
    borderWidth: 1,
    padding: 10,
  },
})

export default LogInScreen
