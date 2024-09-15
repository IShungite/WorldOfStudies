import { Text, Button } from '@rneui/themed'
import { QuestionQcm } from '@world-of-studies/api-types/src/quizzes/qcm-question'
import React, { useState } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'

type Props = {
  question: QuestionQcm
  onNext: () => void
  handleSubmitAnswer: (questionId: string, answer: string) => void // Pass the choiceId as a string
}

const ChoiceQuestion: React.FC<Props> = ({ question, onNext, handleSubmitAnswer }) => {
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null)

  const questionText = 'Select the correct option(s):' //todo: replace with question.text

  const handleChoiceSelect = (choiceId: string) => {
    setSelectedChoiceId(choiceId) // Select the current choice
  }

  const handleNext = () => {
    if (selectedChoiceId) {
      handleSubmitAnswer(question.id, selectedChoiceId) // Submit the selected answer
      onNext() // Move to the next question
    }
  }

  return (
    <View style={styles.container}>
      <Text>{questionText}</Text>
      {question.choices ? (
        question.choices.map((choice) => (
          <TouchableOpacity
            key={choice.id}
            style={[
              styles.choiceButton,
              selectedChoiceId === choice.id ? styles.selectedChoice : null, // Highlight selected choice
            ]}
            onPress={() => handleChoiceSelect(choice.id)}
          >
            <Text style={styles.choiceText}>{choice.label}</Text>
          </TouchableOpacity>
        ))
      ) : (
        <Text>No choices available.</Text>
      )}
      <Button title="Next" style={styles.nextButton} onPress={handleNext} disabled={!selectedChoiceId} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    alignItems: 'center',
  },
  choiceButton: {
    width: '100%',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
    alignItems: 'center',
  },
  selectedChoice: {
    backgroundColor: '#2196f3', // Highlight selected choice
  },
  choiceText: {
    fontSize: 16,
  },
  nextButton: {
    backgroundColor: '#2196f3',
    marginTop: 20,
    width: '100%',
  },
})

export default ChoiceQuestion
