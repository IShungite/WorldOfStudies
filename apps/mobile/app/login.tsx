import { Button, Input } from '@rneui/themed'
import { useForm } from '@tanstack/react-form'
import { zodValidator } from '@tanstack/zod-form-adapter'
import { Redirect, router } from 'expo-router'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, StyleSheet, Text, View } from 'react-native'
import { useMutation } from 'react-query'
import { z } from 'zod'

import kyInstance from '@/api/kyInstance'
import HttpException from '@/exceptions/http.exception'
import { useSession } from '@/providers/session.provider'

export default function Login() {
  const { t } = useTranslation()
  const { session, isLoading: isLoadingSession, signIn } = useSession()

  const { mutate, isLoading } = useMutation(
    async (loginData: { email: string; password: string }) => {
      return (await kyInstance.post('auth/login', { json: loginData }).json()) as { token: string }
    },
    {
      onSuccess: async (data) => {
        signIn(data.token)
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

  if (isLoadingSession) {
    return <Text>Loading..</Text>
  }

  if (session) {
    return <Redirect href="/" />
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('login')}</Text>
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
        onPress={() => router.replace('/register')}
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 20,
  },
})
