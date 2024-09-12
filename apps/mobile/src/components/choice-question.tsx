import { Text, Button } from '@rneui/themed'
import { QuestionQcm } from '@world-of-studies/api-types/src/quizzes'
import React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'

type Props = {
  question: QuestionQcm
  onNext: () => void
}

const ChoiceQuestion: React.FC<Props> = ({ question, onNext }) => {
  const questionText = 'Select the correct option(s):'

  return (
    <View style={styles.container}>
      <Text>{questionText}</Text>
      {question.choices.map((choice) => (
        <TouchableOpacity key={choice.id} style={styles.choiceButton} onPress={() => {}}>
          <Text style={styles.choiceText}>{choice.label}</Text>
        </TouchableOpacity>
      ))}
      <Button title="Next" style={styles.nextButton} onPress={onNext} />
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
  choiceText: {
    fontSize: 16,
  },
  nextButton: {
    backgroundColor: '#2196f3',
    marginTop: 20,
    width: '100%',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
})

export default ChoiceQuestion
