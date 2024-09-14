import { Input, Button as RneButton } from '@rneui/themed'
import { useForm } from '@tanstack/react-form'
import { zodValidator } from '@tanstack/zod-form-adapter'
import { useRouter } from 'expo-router'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, View } from 'react-native'
import { useMutation } from 'react-query'
import { z } from 'zod'

import kyInstance from '@/api/kyInstance'
import Button from '@/components/shared/Button'
import GradientCard from '@/components/shared/GradientCard'
import HttpException from '@/exceptions/http.exception'
import { useSession } from '@/providers/session.provider'

export default function Login() {
  const { t } = useTranslation()
  const { signIn } = useSession()
  const router = useRouter()

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

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <GradientCard title={t('login')} containerStyle={{ width: '80%' }}>
        <form.Field
          name="email"
          validators={{
            onChange: z.string().trim().email(),
          }}
          children={(field) => (
            <View style={{ width: 'auto' }}>
              <Input
                placeholder={t('email')}
                value={field.state.value}
                onChangeText={(e) => field.handleChange(e)}
                keyboardType="email-address"
                autoCapitalize="none"
                disabled={isLoading}
                errorMessage={field.state.meta.errors.map((error) => error).join(', ')}
              />
            </View>
          )}
        />
        <form.Field
          name="password"
          validators={{
            onChange: z.string().min(1).trim(),
          }}
          children={(field) => (
            <View style={{ width: 'auto' }}>
              <Input
                placeholder={t('password')}
                value={field.state.value}
                onChangeText={(e) => field.handleChange(e)}
                secureTextEntry
                autoCapitalize="none"
                disabled={isLoading}
                errorMessage={field.state.meta.errors.map((error) => error).join(', ')}
              />
            </View>
          )}
        />
        <Button title={t('login')} onPress={form.handleSubmit} loading={isLoading} />
        <RneButton
          title={t('no_account_yet')}
          type="clear"
          onPress={() => router.replace('/register')}
          disabled={isLoading}
        />
      </GradientCard>
    </View>
  )
}
