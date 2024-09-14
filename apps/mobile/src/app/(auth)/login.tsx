import { Input, Button as RneButton } from '@rneui/themed'
import { useForm } from '@tanstack/react-form'
import { zodValidator } from '@tanstack/zod-form-adapter'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, StyleSheet, View } from 'react-native'
import { useMutation } from 'react-query'
import { z } from 'zod'

import kyInstance from '@/api/kyInstance'
import Button from '@/components/shared/Button'
import Text from '@/components/shared/Text'
import HttpException from '@/exceptions/http.exception'
import { useSession } from '@/providers/session.provider'

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
      <View style={{ alignItems: 'center', width: '80%' }}>
        <View style={styles.title}>
          <LinearGradient colors={settings.title.container1} style={styles.container1}>
            <LinearGradient colors={settings.title.container2} style={styles.container2}>
              <Text style={styles.titleText}>{t('login')}</Text>
            </LinearGradient>
          </LinearGradient>
        </View>
        <View style={styles.content}>
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
        </View>
      </View>
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
  titleText: {
    textAlign: 'center',
    color: '#fff',
    letterSpacing: 2,
    fontSize: 25,
  },
  container1: {
    borderRadius: 3,
    paddingVertical: 3,
  },
  container2: {
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
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
