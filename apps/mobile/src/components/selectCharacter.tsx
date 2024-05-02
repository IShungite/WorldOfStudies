import { BottomSheetBackdrop, BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from '@gorhom/bottom-sheet'
import React, { useMemo } from 'react'
import { StyleSheet, Text } from 'react-native'

type Props = {
  sheetRef: React.RefObject<BottomSheetModal>
}

export default function SelectCharacter({ sheetRef }: Props) {
  // variables
  const snapPoints = useMemo(() => ['30%', '80%'], [])

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
          <Text>Awesome 🎉</Text>
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
