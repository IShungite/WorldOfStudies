import { useForm } from '@tanstack/react-form'
import { zodValidator } from '@tanstack/zod-form-adapter'
import { useRouter } from 'expo-router'
import React from 'react'
import { View } from 'react-native'
import { useMutation } from 'react-query'
import { z } from 'zod'

import kyInstance from '@/api/kyInstance'
import Button from '@/components/shared/Button'
import Card from '@/components/shared/Card'
import Input from '@/components/shared/Input'
import { useSession } from '@/providers/session.provider'

export default function CreateCharacter() {
  const router = useRouter()
  const { signOut } = useSession()

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
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Card title="Créer un personnage" containerStyle={{ width: '80%' }}>
        <form.Field
          name="name"
          validators={{
            onChange: z.string().trim(),
          }}
        >
          {(field) => (
            <View style={{ width: 'auto' }}>
              <Input field={field} placeholder="Nom" disabled={isLoading} />
            </View>
          )}
        </form.Field>
        <form.Field
          name="promotionId"
          validators={{
            onChange: z.string().trim(),
          }}
        >
          {(field) => (
            <View style={{ width: 'auto' }}>
              <Input field={field} placeholder="Code de la promotion" autoCapitalize="none" disabled={isLoading} />
            </View>
          )}
        </form.Field>
        <Button title="Créer" onPress={form.handleSubmit} loading={isLoading} />

        <View style={{ marginTop: 20, alignItems: 'center' }}>
          <Button title="Retour" style={{ width: '50%' }} color="red" onPress={() => signOut()} />
        </View>
      </Card>
    </View>
  )
}
