import { Button, Input } from '@rneui/themed'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, StyleSheet, View } from 'react-native'
import { useMutation } from 'react-query'

import kyInstance from '../api/kyInstance'

const LogInScreen = () => {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const loginMutation = useMutation(
    async (loginData: { email: string; password: string }) => {
      return kyInstance.post('auth/login', { json: loginData }).json()
    },
    {
      onSuccess: (data) => {
        console.log(data) // TODO: Save token to AsyncStorage and navigate to the home screen
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

  return (
    <View style={styles.container}>
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
      <Button title={t('login')} onPress={handleSubmit} loading={isLoading} />
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

export default LogInScreen
