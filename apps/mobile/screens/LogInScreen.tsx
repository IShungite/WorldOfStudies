import { useNavigation } from '@react-navigation/native'
import { Button, Input } from '@rneui/themed'
import { useForm } from '@tanstack/react-form'
import { zodValidator } from '@tanstack/zod-form-adapter'
import * as SecureStore from 'expo-secure-store'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, StyleSheet, View } from 'react-native'
import { useMutation } from 'react-query'
import { z } from 'zod'

import kyInstance from '../api/kyInstance'
import HttpException from '../exceptions/http.exception'

const LogInScreen = () => {
  const { t } = useTranslation()
  const navigation = useNavigation<any>()

  const { mutate, isLoading } = useMutation(
    async (loginData: { email: string; password: string }) => {
      return (await kyInstance.post('auth/login', { json: loginData }).json()) as { token: string }
    },
    {
      onSuccess: async (data) => {
        await SecureStore.setItemAsync('token', data.token)

        navigation.navigate('Home')
      },
      onError: (error: HttpException) => {
        Alert.alert('Login failed', error.message)
      },
    }
  )

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async (data) => {
      mutate(data.value)
    },
    validatorAdapter: zodValidator,
  })

  return (
    <View style={styles.container}>
      <form.Field
        name="email"
        validators={{
          onChange: z.string().trim().email(),
        }}
        children={(field) => (
          <>
            <Input
              placeholder={t('email')}
              value={field.state.value}
              onChangeText={(e) => field.handleChange(e)}
              keyboardType="email-address"
              autoCapitalize="none"
              disabled={isLoading}
              errorMessage={field.state.meta.errors.map((error) => error).join(', ')}
            />
          </>
        )}
      />

      <form.Field
        name="password"
        validators={{
          onChange: z.string().min(1).trim(),
        }}
        children={(field) => (
          <Input
            placeholder={t('password')}
            value={field.state.value}
            onChangeText={(e) => field.handleChange(e)}
            secureTextEntry
            autoCapitalize="none"
            disabled={isLoading}
            errorMessage={field.state.meta.errors.map((error) => error).join(', ')}
          />
        )}
      />

      <Button title={t('login')} onPress={form.handleSubmit} loading={isLoading} />
      <Button
        title={t('no_account_yet')}
        type="clear"
        onPress={() => navigation.navigate('Register')}
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

export default LogInScreen
