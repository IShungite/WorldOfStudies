import React, { useState } from 'react'
import { View, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native'
import { useMutation } from 'react-query'

import axiosInstance from '../api/axiosInstance'

const SignUpScreen = () => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Setup mutation using React Query
  const { mutate, isLoading } = useMutation(
    async (newUser: { firstName: string; lastName: string; email: string; password: string }) => {
      return await axiosInstance.post('/auth/register', newUser)
    },
    {
      onSuccess: () => {
        Alert.alert('Success', 'Registration successful, please log in.')
      },
      onError: (error: any) => {
        Alert.alert('Error', `Registration failed, please try again. ${error.message}`)
      },
    }
  )

  const handleSubmit = () => {
    mutate({ firstName, lastName, email, password })
  }

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder="First Name" value={firstName} onChangeText={setFirstName} />
      <TextInput style={styles.input} placeholder="Last Name" value={lastName} onChangeText={setLastName} />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Register" onPress={handleSubmit} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 40,
    marginBottom: 12,
    borderWidth: 1,
    padding: 10,
  },
})

export default SignUpScreen
