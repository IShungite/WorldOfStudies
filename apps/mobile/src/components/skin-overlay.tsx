import { InventoryItem } from '@world-of-studies/api-types/src/inventory/models/inventory_item'
import { useAtom } from 'jotai'
import React from 'react'
import { View, StyleSheet, FlatList } from 'react-native'

import kyInstance from '@/api/kyInstance'
import Overlay from '@/components/shared/Overlay'
import SkinItem from '@/components/skin-card'
import { selectedCharacterAtom } from '@/providers/selected-character'

type Props = {
  isVisible: boolean
  skins: InventoryItem[]
  onBackdropPress: () => void
}

const SkinOverlay: React.FC<Props> = ({ isVisible, onBackdropPress, skins }) => {
  const [selectedCharacter, setSelectedCharacter] = useAtom(selectedCharacterAtom)

  const switchSkin = async (skin: string) => {
    try {
      if (!selectedCharacter) {
        alert('No character selected')
        return
      }
      await kyInstance
        .patch(`characters/${selectedCharacter.id}`, {
          json: {
            skin,
          },
        })
        .json()
      setSelectedCharacter({ ...selectedCharacter, skin })
    } catch (error) {
      alert(error)
    }
  }

  return (
    <Overlay isVisible={isVisible} onBackdropPress={onBackdropPress} title="Skins">
      <View style={styles.content}>
        <FlatList
          data={skins}
          renderItem={({ item }) => <SkinItem item={item} onPress={() => switchSkin(item.image)} />}
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
