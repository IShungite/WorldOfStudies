import { OverlayProps, Overlay as OverlayRne } from '@rneui/themed'
import React from 'react'

import Card from '@/components/shared/Card'

type Props = OverlayProps & {
  title: string
}

const Overlay = ({ children, title, ...props }: Props) => {
  return (
    <OverlayRne {...props} overlayStyle={{ padding: 0, elevation: 0, backgroundColor: 'transparent' }}>
      <Card title={title}>{children}</Card>
    </OverlayRne>
  )
}

export default Overlay
