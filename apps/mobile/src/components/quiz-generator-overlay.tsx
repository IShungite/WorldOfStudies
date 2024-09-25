import { Quiz } from '@world-of-studies/api-types/src/quizzes/quiz'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { View, StyleSheet, Button, ScrollView, TextInput } from 'react-native' // For generating random IDs

import Overlay from '@/components/shared/Overlay'
import Text from '@/components/shared/Text'
import { useGenerateQuiz } from '@/hooks/useQuizGenerator'

type QuizGeneratorOverlayProps = {
  isVisible: boolean
  onClose: () => void
}

export default function QuizGeneratorOverlay({ isVisible, onClose }: QuizGeneratorOverlayProps) {
  const [selectedSubject, setSelectedSubject] = useState('')
  const [theme, setTheme] = useState('')

  const { mutate: generateQuiz, data, isLoading } = useGenerateQuiz()
  const dictSubject: { [key: string]: string } = {
    Mathématique: 'Maths',
    Science: 'Science',
    Histoire: 'History',
    Géographie: 'Geography',
    Anglais: 'English',
    Français: 'French',
    Espagnol: 'Spanish',
    Allemand: 'German',
  }
  const router = useRouter()

  const handleValidate = () => {
    generateQuiz(
      { subject: selectedSubject, theme },
      {
        onSuccess: (generatedQuiz) => {
          // Generate a random ID for the quiz
          const randomId = Math.floor(Math.random() * 100000).toString()

          // Stringify the generated quiz for navigation
          const stringifiedQuiz = JSON.stringify(generatedQuiz)

          onClose()

          // Navigate to the exercice/[id] screen with the quiz data
          router.push({
            pathname: `/(tabs)/exercices/[id]`,
            params: { id: randomId, exercice: stringifiedQuiz, isAiMode: 'true' },
          })
        },
      }
    )
  }

  return (
    <Overlay isVisible={isVisible} onBackdropPress={onClose} title="Générer un quiz IA">
      <View style={styles.overlayContainer}>
        <Text style={styles.overlayTitle}>Générer un quiz IA</Text>

        {/* Subject Selector */}
        <Text style={styles.label}>Choisir une matière :</Text>
        <TextInput
          style={styles.input}
          placeholder="Sélectionner un sujet"
          value={selectedSubject}
          onChangeText={setSelectedSubject}
        />

        {/* Subject Options */}
        <ScrollView style={styles.subjectList}>
          {Object.keys(dictSubject).map((subject) => (
            <Text key={subject} style={styles.subjectItem} onPress={() => setSelectedSubject(dictSubject[subject])}>
              {subject}
            </Text>
          ))}
        </ScrollView>

        {/* Theme Input */}
        <Text style={styles.label}>Thème :</Text>
        <TextInput style={styles.input} placeholder="Entrer un thème" value={theme} onChangeText={setTheme} />

        {/* Validate Button */}
        <Button title="Valider" onPress={handleValidate} />
        {isLoading && <Text>Loading...</Text>}
      </View>
    </Overlay>
  )
}

const styles = StyleSheet.create({
  overlayContainer: {
    padding: 20,
  },
  overlayTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  subjectList: {
    maxHeight: 100,
  },
  subjectItem: {
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
})
