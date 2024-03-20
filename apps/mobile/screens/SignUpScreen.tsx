import { useNavigation } from '@react-navigation/native'
import { Input, Button } from '@rneui/themed'
import React, { useState } from 'react'
import { View, StyleSheet, Alert } from 'react-native'
import { useMutation } from 'react-query'

import axiosInstance from '../api/axiosInstance'

const SignUpScreen = () => {
  const navigation = useNavigation<any>()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { mutate, isLoading } = useMutation(
    async (newUser: { firstName: string; lastName: string; email: string; password: string }) => {
      return await axiosInstance.post('/auth/register', newUser)
    },
    {
      onSuccess: () => {
        Alert.alert('Success', 'Registration successful, please log in.')
        navigation.navigate('LogIn')
      },
      onError: (error: any) => {
        Alert.alert('Error', `Registration failed, please try again. ${error.message}`)
      },
    }
  )

  const handleSubmit = () => {
    mutate({ firstName, lastName, email, password })
  }

  return (
    <View style={styles.container}>
      <Input placeholder="First Name" value={firstName} onChangeText={setFirstName} disabled={isLoading} />
      <Input placeholder="Last Name" value={lastName} onChangeText={setLastName} disabled={isLoading} />
      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        disabled={isLoading}
      />
      <Input
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        disabled={isLoading}
      />
      <Button title="Register" onPress={handleSubmit} loading={isLoading} />
      <Button
        title="Vous avez déjà un compte ? Cliquez ici"
        type="clear"
        onPress={() => navigation.navigate('LogIn')}
        disabled={isLoading}
      />
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

export default SignUpScreen
