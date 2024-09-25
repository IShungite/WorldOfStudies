import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import ExamsContainer from '@/components/ExamsContainer'
import QuizGeneratorOverlay from '@/components/quiz-generator-overlay'
import Button from '@/components/shared/Button'

export default function HomeScreen() {
  const { t } = useTranslation()

  const [overlayVisible, setOverlayVisible] = useState(false)

  return (
    <>
      <ExamsContainer />
      {/* "Générer un quiz IA" Button */}
      <View style={styles.centered}>
        <Button title="Générer un quiz IA" onPress={() => setOverlayVisible(true)} />
      </View>

      {/* Quiz Generator Overlay */}
      <QuizGeneratorOverlay isVisible={overlayVisible} onClose={() => setOverlayVisible(false)} />
    </>
  )
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
