import { useAtomValue } from 'jotai'
import React, { useState } from 'react'
import { Image, ScrollView, StyleSheet } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

import ProfileCard from '@/components/profile-card'
import PageLoader from '@/components/shared/PageLoader'
import SkinOverlay from '@/components/skin-overlay'
import { useInventory } from '@/hooks/useInventory'
import { selectedCharacterAtom } from '@/providers/selected-character'

const Profile = () => {
  const selectedCharacter = useAtomValue(selectedCharacterAtom)
  const [overlayVisible, setOverlayVisible] = useState(false)

  const { data: inventory, isLoading: isInventoryLoading } = useInventory(selectedCharacter?.id ?? '')

  if (!selectedCharacter) {
    return null
  }

  const showOverlay = () => {
    setOverlayVisible(true)
  }

  if (isInventoryLoading) return <PageLoader />

  return (
    <ScrollView style={{ marginTop: 5, marginHorizontal: 5 }}>
      <ProfileCard character={selectedCharacter} />
      <TouchableOpacity onPress={showOverlay}>
        <Image
          source={{ uri: process.env.EXPO_PUBLIC_FOLDER_URL + '/' + selectedCharacter.skin }}
          style={styles.avatar}
        />
      </TouchableOpacity>

      {overlayVisible && (
        <SkinOverlay
          isVisible={overlayVisible}
          skins={inventory ?? []}
          onBackdropPress={() => setOverlayVisible(false)}
        />
      )}
    </ScrollView>
  )
}

// Styles pour la page
const styles = StyleSheet.create({
  avatar: {
    width: 350,
    height: 450,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default Profile
