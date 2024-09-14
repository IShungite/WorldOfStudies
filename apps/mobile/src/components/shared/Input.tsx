import { InputProps, Input as RneInput } from '@rneui/themed'
import { FieldApi } from '@tanstack/react-form'
import React from 'react'

type Props = InputProps & {
  field: FieldApi<any, any, any, any, any>
}

const Input = ({ field, ...props }: Props) => {
  return (
    <RneInput
      {...props}
      value={field.state.value}
      onChangeText={(e) => field.handleChange(e)}
      errorMessage={field.state.meta.errors.map((error) => error).join(', ')}
      inputStyle={{ color: '#dbe8ff' }}
      placeholderTextColor="#7f8da8"
    />
  )
}

export default Input
