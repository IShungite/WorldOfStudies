import { InventoryItem } from '@world-of-studies/api-types/src/inventory/models/inventory_item'
import React from 'react'
import { View, StyleSheet, FlatList } from 'react-native'

import Overlay from '@/components/shared/Overlay'
import SkinItem from '@/components/skin-card'

type Props = {
  isVisible: boolean
  skins: InventoryItem[]
  onBackdropPress: () => void
}

const SkinOverlay: React.FC<Props> = ({ isVisible, onBackdropPress, skins }) => {
  return (
    <Overlay isVisible={isVisible} onBackdropPress={onBackdropPress} title="Skins">
      <View style={styles.content}>
        <FlatList
          data={skins}
          renderItem={({ item }) => <SkinItem item={item} onPress={() => {}} />}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
        />
      </View>
    </Overlay>
  )
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    width: '100%',
  },
})

export default SkinOverlay
