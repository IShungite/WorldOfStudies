import { useAtom } from 'jotai'
import { Image, StyleSheet, ScrollView, View, Text } from 'react-native'

import ProfileCard from '@/components/profile-card'
import { selectedCharacterAtom } from '@/providers/selected-character'

const Profile = () => {
  const [selectedCharacterResponse] = useAtom(selectedCharacterAtom)
  const selectedCharacter = selectedCharacterResponse || null

  if (!selectedCharacter) {
    return (
      <View style={styles.centered}>
        <Text>Character not selected</Text>
      </View>
    )
  }

  return (
    <ScrollView style={{ marginTop: 5 }}>
      <ProfileCard character={selectedCharacter} />
      <Image
        source={{ uri: process.env.EXPO_PUBLIC_FOLDER_URL + '/' + selectedCharacter.skin }}
        style={styles.avatar}
      />
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
