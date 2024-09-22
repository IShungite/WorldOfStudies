import { CharacterInventoryResponse } from '@world-of-studies/api-types/src/character/character_inventory_response'
import { InventoryItem } from '@world-of-studies/api-types/src/inventory'
import { useFocusEffect } from 'expo-router'
import { useAtom } from 'jotai'
import React, { useState } from 'react'
import { Image, StyleSheet, ScrollView, View, Text, ActivityIndicator } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

import kyInstance from '@/api/kyInstance'
import ProfileCard from '@/components/profile-card'
import SkinOverlay from '@/components/skin-overlay'
import { selectedCharacterAtom } from '@/providers/selected-character'

const Profile = () => {
  const [selectedCharacterResponse] = useAtom(selectedCharacterAtom)
  const selectedCharacter = selectedCharacterResponse || null
  const [ownedSkins, setOwnedSkins] = useState<InventoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [overlayVisible, setOverlayVisible] = useState(false)

  const fetchInventory = async () => {
    try {
      if (!selectedCharacter) {
        alert('No character selected')
        return
      }
      const response = (await kyInstance
        .get(`characters/${selectedCharacter.id}/inventory`)
        .json()) as CharacterInventoryResponse
      if (response) {
        setOwnedSkins(response.result.items.filter((item) => item.type === 'SKIN'))
      }
    } catch (error) {
      alert(error)
    } finally {
      setIsLoading(false)
    }
  }

  // Trigger the API call when the component mounts
  useFocusEffect(
    React.useCallback(() => {
      fetchInventory()
    }, [])
  )

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />
  }

  if (!selectedCharacter) {
    return (
      <View style={styles.centered}>
        <Text>Character not selected</Text>
      </View>
    )
  }

  if (isLoading)
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading skins...</Text>
      </View>
    )

  const showOverlay = () => {
    setOverlayVisible(true)
  }

  return (
    <ScrollView style={{ marginTop: 5 }}>
      <ProfileCard character={selectedCharacter} />
      <TouchableOpacity onPress={showOverlay}>
        <Image
          source={{ uri: process.env.EXPO_PUBLIC_FOLDER_URL + '/' + selectedCharacter.skin }}
          style={styles.avatar}
        />
      </TouchableOpacity>

      {overlayVisible && ownedSkins && (
        <SkinOverlay isVisible={overlayVisible} skins={ownedSkins} onBackdropPress={() => setOverlayVisible(false)} />
      )}
    </ScrollView>
  )
}

// Styles pour la page
const styles = StyleSheet.create({
  avatar: {
    width: 250,
    height: 350,
    alignSelf: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default Profile
