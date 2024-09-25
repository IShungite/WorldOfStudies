import React from 'react'
import { ActivityIndicator, View } from 'react-native'

const PageLoader = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size={50} color="#8594b2" />
    </View>
  )
}

export default PageLoader
