import React, { useState } from 'react'
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native'

const SignUpScreen = () => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, lastName, email, password }),
      })

      if (!response.ok) {
        // If the server response was not OK, throw an error with the status
        const errorData = await response.text() // or .json() if your server responds with JSON
        throw new Error(`Server responded with ${response.status}: ${errorData}`)
      }

      const data = await response.json() // Assuming the response is JSON
      // Handle success, for example, navigate or show success message
      Alert.alert('Success', 'Registration successful, please log in.')
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Registration failed:', error.message)
        console.log(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`)
        Alert.alert('Error', `Registration failed, please try again. ${error.message}`)
      } else {
        // Handle cases where the error is not an Error object
        console.log(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`)
        console.error('Registration failed with an unknown error:', error)
        Alert.alert('Error', 'Registration failed due to an unknown error, please try again.')
      }
    }
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
  input: {
    height: 40,
    marginBottom: 12,
    borderWidth: 1,
    padding: 10,
  },
})

export default SignUpScreen
