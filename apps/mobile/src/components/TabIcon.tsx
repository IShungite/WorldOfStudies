import React from 'react'
import { Image, ImageSourcePropType, View } from 'react-native'

import Text from '@/components/shared/Text'
type Props = {
  isSelected: boolean
  icon: ImageSourcePropType
  label: string
  withBorderLeft?: boolean
  withBorderRight?: boolean
  fontSize?: number
}

const TabIcon = ({ isSelected, icon, label, withBorderLeft = true, withBorderRight = true, fontSize = 15 }: Props) => {
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,

        backgroundColor: isSelected ? '#bfd4ff' : '#8594b2',
        height: '100%',
        width: '100%',

        borderColor: '#d1e0fd',
        borderLeftWidth: withBorderLeft ? 1 : 0,
        borderRightWidth: withBorderRight ? 1 : 0,
      }}
    >
      <Image source={icon} style={{ width: 40, height: 40 }} />
      {isSelected && <Text style={{ fontSize, marginBottom: 15, color: '#627291' }}>{label}</Text>}
    </View>
  )
}

export default TabIcon
