import { InventoryItem } from '@world-of-studies/api-types/src/inventory/models/inventory_item'
import { useAtom } from 'jotai'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View, StyleSheet, FlatList } from 'react-native'

import kyInstance from '@/api/kyInstance'
import Overlay from '@/components/shared/Overlay'
import PageLoader from '@/components/shared/PageLoader'
import SkinItem from '@/components/skin-card'
import { selectedCharacterAtom } from '@/providers/selected-character'

type Props = {
  isVisible: boolean
  skins: InventoryItem[]
  onBackdropPress: () => void
}

const SkinOverlay: React.FC<Props> = ({ isVisible, onBackdropPress, skins }) => {
  const [selectedCharacter, setSelectedCharacter] = useAtom(selectedCharacterAtom)
  const [isLoading, setIsLoading] = useState(false)
  const { t } = useTranslation()

  const switchSkin = async (skin: string) => {
    setIsLoading(true)
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
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Overlay isVisible={isVisible} onBackdropPress={onBackdropPress} title={t('skins')}>
      <View style={styles.content}>
        {isLoading ? (
          <PageLoader />
        ) : (
          <FlatList
            data={skins}
            renderItem={({ item }) => <SkinItem item={item} onPress={() => switchSkin(item.image)} />}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
          />
        )}
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
