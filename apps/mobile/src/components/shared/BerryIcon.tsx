import React from 'react'
import { Image } from 'react-native'

type Props = {
  size?: number
}

const BerryIcon = ({ size = 20 }: Props) => {
  return <Image source={require('../../assets/images/berry.webp')} style={{ width: size, height: size }} />
}

export default BerryIcon
