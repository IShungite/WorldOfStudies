import { Button as RneButton } from '@rneui/themed'
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
import Card from '@/components/shared/Card'
import Input from '@/components/shared/Input'

export default function RegisterScreen() {
  const { t } = useTranslation()
  const router = useRouter()

  const { mutate, isLoading } = useMutation(
    async (newUser: { firstName: string; lastName: string; email: string; password: string }) => {
      return kyInstance.post('auth/register', { json: newUser }).json()
    },
    {
      onSuccess: () => {
        Alert.alert('Success', 'Registration successful, please log in.')
        router.replace('/login')
      },
      onError: (error: any) => {
        Alert.alert('Registration failed', error.message)
      },
    }
  )

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
    },
    onSubmit: async (data) => {
      mutate(data.value)
    },
    validatorAdapter: zodValidator(),
  })

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Card title={t('login')} containerStyle={{ width: '80%' }}>
        <form.Field
          name="firstName"
          validators={{
            onChange: z.string().min(1).trim(),
          }}
        >
          {(field) => (
            <View style={{ width: 'auto' }}>
              <Input field={field} placeholder={t('first_name')} disabled={isLoading} />
            </View>
          )}
        </form.Field>
        <form.Field
          name="lastName"
          validators={{
            onChange: z.string().min(1).trim(),
          }}
        >
          {(field) => (
            <View style={{ width: 'auto' }}>
              <Input field={field} placeholder={t('last_name')} disabled={isLoading} />
            </View>
          )}
        </form.Field>
        <form.Field
          name="email"
          validators={{
            onChange: z.string().trim().email(),
          }}
        >
          {(field) => (
            <View style={{ width: 'auto' }}>
              <Input
                field={field}
                placeholder={t('email')}
                keyboardType="email-address"
                autoCapitalize="none"
                disabled={isLoading}
              />
            </View>
          )}
        </form.Field>
        <form.Field
          name="password"
          validators={{
            onChange: z.string().min(1).trim(),
          }}
        >
          {(field) => (
            <View style={{ width: 'auto' }}>
              <Input
                field={field}
                placeholder={t('password')}
                secureTextEntry
                autoCapitalize="none"
                disabled={isLoading}
              />
            </View>
          )}
        </form.Field>
        <Button title={t('register')} onPress={form.handleSubmit} loading={isLoading} />
        <RneButton
          title={t('already_have_account')}
          type="clear"
          onPress={() => router.replace('/login')}
          disabled={isLoading}
        />
      </Card>
    </View>
  )
}
