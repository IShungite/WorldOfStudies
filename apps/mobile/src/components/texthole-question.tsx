import { Text, Input, Button } from '@rneui/themed'
import { QuestionTextHole } from '@world-of-studies/api-types/src/quizzes/text-hole-question'
import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'

type Props = {
  question: QuestionTextHole
  onNext: () => void
  handleSubmitAnswer: (questionId: string, answer: string[]) => void // Add handleSubmitAnswer prop
}

const TextHoleQuestion: React.FC<Props> = ({ question, onNext, handleSubmitAnswer }) => {
  const [userInputs, setUserInputs] = useState<string[]>(Array(question.answers.length).fill(''))

  const handleInputChange = (value: string, index: number) => {
    const newInputs = [...userInputs]
    newInputs[index] = value
    setUserInputs(newInputs)
  }

  const handleSubmit = () => {
    handleSubmitAnswer(question.id, userInputs) // Call handleSubmitAnswer with user inputs
    onNext()
  }

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        {question.text.split('@@').map((part, index) => (
          <React.Fragment key={index}>
            <Text>{part}</Text>
            {index < question.answers.length && (
              <Input
                placeholder="..."
                value={userInputs[index]}
                onChangeText={(value) => handleInputChange(value, index)}
                containerStyle={styles.input}
              />
            )}
          </React.Fragment>
        ))}
      </View>
      <Button title="Next" onPress={handleSubmit} buttonStyle={styles.nextButton} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  textContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  input: {
    width: 100,
    marginHorizontal: 5,
  },
  nextButton: {
    backgroundColor: '#2196f3',
    marginTop: 20,
  },
})

export default TextHoleQuestion
