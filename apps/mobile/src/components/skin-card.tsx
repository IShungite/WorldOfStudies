import { InventoryItem } from '@world-of-studies/api-types/src/inventory/models/inventory_item'
import React from 'react'
import { TouchableOpacity, StyleSheet, Image } from 'react-native'

import Container from '@/components/shared/Container'
import Text from '@/components/shared/Text'

type Props = {
  item: InventoryItem
  onPress: () => void
}

const SkinItem: React.FC<Props> = ({ item, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Container>
        <Text style={styles.skinName}>{item.name}</Text>
        <Image source={{ uri: process.env.EXPO_PUBLIC_FOLDER_URL + '/' + item.image }} style={styles.skin} />
      </Container>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  skinName: {
    color: '#fff',
    textAlign: 'center',
    marginBottom: 15,
    fontSize: 20,
  },
  skin: {
    width: 50,
    height: 50,
    alignSelf: 'center',
  },
})

export default SkinItem
