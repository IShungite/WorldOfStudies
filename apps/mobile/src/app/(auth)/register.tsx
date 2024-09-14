import { Input, Button as RneButton } from '@rneui/themed'
import { useForm } from '@tanstack/react-form'
import { zodValidator } from '@tanstack/zod-form-adapter'
import { useRouter } from 'expo-router'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, StyleSheet, View } from 'react-native'
import { useMutation } from 'react-query'
import { z } from 'zod'

import kyInstance from '@/api/kyInstance'
import Button from '@/components/shared/Button'
import GradientCard from '@/components/shared/GradientCard'
import GradientContainer from '@/components/shared/GradientContainer'
import Text from '@/components/shared/Text'

const settings = {
  title: {
    container1: ['#b1cae8', '#26506d'],
    container2: ['#5f92cf', '#346b9a'],
  },
  content: {
    backgroundColor: '#2e424f',
  },
  border: {
    color: '#11181c',
    width: 4,
  },
}

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
    validatorAdapter: zodValidator,
  })

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <GradientCard title={t('login')} containerStyle={{ width: '80%' }}>
        <form.Field
          name="firstName"
          validators={{
            onChange: z.string().min(1).trim(),
          }}
          children={(field) => (
            <View style={{ width: 'auto' }}>
              <Input
                placeholder={t('first_name')}
                value={field.state.value}
                onChangeText={(e) => field.handleChange(e)}
                disabled={isLoading}
                errorMessage={field.state.meta.errors.map((error) => error).join(', ')}
              />
            </View>
          )}
        />
        <form.Field
          name="lastName"
          validators={{
            onChange: z.string().min(1).trim(),
          }}
          children={(field) => (
            <View style={{ width: 'auto' }}>
              <Input
                placeholder={t('last_name')}
                value={field.state.value}
                onChangeText={(e) => field.handleChange(e)}
                disabled={isLoading}
                errorMessage={field.state.meta.errors.map((error) => error).join(', ')}
              />
            </View>
          )}
        />
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
        <Button title={t('register')} onPress={form.handleSubmit} loading={isLoading} />
        <RneButton
          title={t('already_have_account')}
          type="clear"
          onPress={() => router.replace('/login')}
          disabled={isLoading}
        />
      </GradientCard>
    </View>
  )
}

const styles = StyleSheet.create({
  title: {
    borderColor: settings.border.color,
    borderWidth: settings.border.width,
    borderRadius: 8,
    width: '120%',
  },
  gradientContainer: {
    borderRadius: 3,
  },
  titleText: {
    textAlign: 'center',
    color: '#fff',
    letterSpacing: 2,
    fontSize: 25,
  },
  content: {
    marginTop: -settings.border.width,
    borderWidth: settings.border.width,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderColor: settings.border.color,
    backgroundColor: settings.content.backgroundColor,
    padding: 20,
  },
})
