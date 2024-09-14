import { BottomSheetBackdrop, BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from '@gorhom/bottom-sheet'
import { useSetAtom } from 'jotai'
import React, { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'

import LogoutButton from '@/components/logoutButton'
import Button from '@/components/shared/Button'
import Text from '@/components/shared/Text'
import { useMyCharacters } from '@/hooks/useMyCharacters'
import { selectedCharacterAtom } from '@/providers/selected-character'

type Props = {
  sheetRef: React.RefObject<BottomSheetModal>
}

export default function SelectCharacter({ sheetRef }: Props) {
  // variables
  const snapPoints = useMemo(() => ['50%', '90%'], [])

  const { data } = useMyCharacters()

  const setSelectedCharacter = useSetAtom(selectedCharacterAtom)

  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        style={{ flex: 0 }}
        handleIndicatorStyle={{ backgroundColor: '#fff' }}
        backgroundStyle={{ backgroundColor: '#2e424e', borderColor: '#11181c', borderWidth: 4 }}
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
          <Text style={{ color: '#fff', marginBottom: 20, marginTop: 20 }}>Personnages</Text>
          {data?.map((character) => {
            return (
              <View style={{ marginBottom: 7 }} key={character.id}>
                <Button
                  onPress={() => {
                    setSelectedCharacter(character)
                    sheetRef.current?.close()
                  }}
                  style={{ width: 250 }}
                >
                  {({ color }) => (
                    <View style={{ flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                      <Text style={{ color }}>{character.name}</Text>
                      {/* <Text style={{ color, fontSize: 12 }}>2021-2022</Text> */}
                    </View>
                  )}
                </Button>
              </View>
            )
          })}

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
    backgroundColor: '#2e424e',
    borderColor: '#11181c',
    borderWidth: 4,
    borderTopWidth: 0,
  },
})
