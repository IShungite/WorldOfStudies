import React from 'react'
import { View, StyleSheet } from 'react-native'

const Container = ({ children }: { children: React.ReactNode }) => {
  return <View style={styles.container}>{children}</View>
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2e424f',
    borderWidth: 4,
    borderColor: '#11181c',
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
})

export default Container
