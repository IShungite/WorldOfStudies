import { useNavigation } from '@react-navigation/native'
import { Button, Input } from '@rneui/themed'
import { useForm } from '@tanstack/react-form'
import { zodValidator } from '@tanstack/zod-form-adapter'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, StyleSheet, View } from 'react-native'
import { useMutation } from 'react-query'
import { z } from 'zod'

import kyInstance from '../api/kyInstance'

const RegisterScreen = () => {
  const { t } = useTranslation()
  const navigation = useNavigation<any>()

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
    <View style={styles.container}>
      <form.Field
        name="firstName"
        validators={{
          onChange: z.string().min(1).trim(),
        }}
        children={(field) => (
          <>
            <Input
              placeholder={t('first_name')}
              value={field.state.value}
              onChangeText={(e) => field.handleChange(e)}
              disabled={isLoading}
              errorMessage={field.state.meta.errors.map((error) => error).join(', ')}
            />
          </>
        )}
      />
      <form.Field
        name="lastName"
        validators={{
          onChange: z.string().min(1).trim(),
        }}
        children={(field) => (
          <>
            <Input
              placeholder={t('last_name')}
              value={field.state.value}
              onChangeText={(e) => field.handleChange(e)}
              disabled={isLoading}
              errorMessage={field.state.meta.errors.map((error) => error).join(', ')}
            />
          </>
        )}
      />
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

      <Button title={t('register')} onPress={form.handleSubmit} loading={isLoading} />
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

export default RegisterScreen
