import React from 'react'
import { TextProps, Text as TextRn } from 'react-native'

const Text = ({ children, ...props }: TextProps) => {
  return (
    <TextRn {...props} style={[{ fontFamily: 'JungleAdventurer', fontSize: 17, letterSpacing: 0.7 }, props.style]}>
      {children}
    </TextRn>
  )
}

export default Text
