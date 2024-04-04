import { useNavigation } from '@react-navigation/native'
import { Button, Input } from '@rneui/themed'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, StyleSheet, View } from 'react-native'
import { useMutation } from 'react-query'

import kyInstance from '../api/kyInstance'

const SignUpScreen = () => {
  const { t } = useTranslation()
  const navigation = useNavigation<any>()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { mutate, isLoading } = useMutation(
    async (newUser: { firstName: string; lastName: string; email: string; password: string }) => {
      return kyInstance.post('auth/register', { json: newUser }).json()
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
      <Input placeholder={t('first_name')} value={firstName} onChangeText={setFirstName} disabled={isLoading} />
      <Input placeholder={t('last_name')} value={lastName} onChangeText={setLastName} disabled={isLoading} />
      <Input
        placeholder={t('email')}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        disabled={isLoading}
      />
      <Input
        placeholder={t('password')}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        disabled={isLoading}
      />
      <Button title={t('register')} onPress={handleSubmit} loading={isLoading} />
      <Button
        title={t('already_have_account')}
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
