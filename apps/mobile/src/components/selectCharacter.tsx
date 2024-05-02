import { BottomSheetBackdrop, BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from '@gorhom/bottom-sheet'
import { Button } from '@rneui/themed'
import { useAtom } from 'jotai'
import React, { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import LogoutButton from '@/components/logoutButton'
import { useMyCharacters } from '@/hooks/useMyCharacters'
import { selectedCharacterAtom } from '@/providers/selected-character'

type Props = {
  sheetRef: React.RefObject<BottomSheetModal>
}

export default function SelectCharacter({ sheetRef }: Props) {
  // variables
  const snapPoints = useMemo(() => ['50%', '90%'], [])

  const { data } = useMyCharacters()

  const [, setSelectedCharacter] = useAtom(selectedCharacterAtom)

  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        style={{ flex: 0 }}
        ref={sheetRef}
        snapPoints={snapPoints}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            appearsOnIndex={0}
            disappearsOnIndex={-1}
            style={[{ backgroundColor: 'rgba(0, 0, 0, 1)' }, StyleSheet.absoluteFillObject]}
          />
        )}
      >
        <BottomSheetView style={styles.contentContainer}>
          <Text>Personnages</Text>
          {data?.map((character) => (
            <View style={{ marginBottom: 7 }} key={character.id}>
              <Button
                onPress={() => {
                  setSelectedCharacter(character)
                  sheetRef.current?.close()
                }}
              >
                {character.name}
              </Button>
            </View>
          ))}
          <View style={{ marginTop: 20 }}>
            <LogoutButton />
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  )
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
})
