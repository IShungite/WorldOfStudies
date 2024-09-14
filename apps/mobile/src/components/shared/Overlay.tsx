import { OverlayProps, Overlay as OverlayRne } from '@rneui/themed'
import React from 'react'

import GradientCard from '@/components/shared/GradientCard'

type Props = OverlayProps & {
  title: string
}

const Overlay = ({ children, title, ...props }: Props) => {
  return (
    <OverlayRne {...props} overlayStyle={{ padding: 0, elevation: 0, backgroundColor: 'transparent' }}>
      <GradientCard title={title}>{children}</GradientCard>
    </OverlayRne>
  )
}

export default Overlay
