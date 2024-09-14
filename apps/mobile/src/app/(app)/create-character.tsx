import { useForm } from '@tanstack/react-form'
import { zodValidator } from '@tanstack/zod-form-adapter'
import { useRouter } from 'expo-router'
import React from 'react'
import { Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useMutation } from 'react-query'
import { z } from 'zod'

import kyInstance from '@/api/kyInstance'
import Button from '@/components/shared/Button'
import Input from '@/components/shared/Input'

export default function CreateCharacter() {
  const router = useRouter()

  const { mutate, isLoading } = useMutation(
    async (data: { name: string; promotionId: string }) => {
      return await kyInstance.post('characters', { json: data }).json()
    },
    {
      onSuccess: () => {
        router.replace('/(app)/(tabs)')
      },
      onError: (error) => {
        alert((error as Error).message)
      },
    }
  )

  const form = useForm({
    defaultValues: {
      name: '',
      promotionId: '',
    },
    onSubmit: (data) => {
      mutate(data.value)
    },
    validatorAdapter: zodValidator(),
  })

  return (
    <SafeAreaView>
      <Text>Creation du personnage..</Text>
      <form.Field
        name="name"
        validators={{
          onChange: z.string().trim(),
        }}
      >
        {(field) => <Input field={field} placeholder="Nom" disabled={isLoading} />}
      </form.Field>
      <form.Field
        name="promotionId"
        validators={{
          onChange: z.string().trim(),
        }}
      >
        {(field) => <Input field={field} placeholder="Code de la promotion" disabled={isLoading} />}
      </form.Field>

      <Button title="Créer" onPress={form.handleSubmit} loading={isLoading} />
    </SafeAreaView>
  )
}
