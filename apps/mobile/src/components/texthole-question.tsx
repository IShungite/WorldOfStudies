import { Text, Input, Button } from '@rneui/themed'
import { QuestionTextHole } from '@world-of-studies/api-types/src/quizzes'
import React from 'react'
import { View, StyleSheet } from 'react-native'

type Props = {
  question: QuestionTextHole
  onNext: () => void
}

const TextHoleQuestion: React.FC<Props> = ({ question, onNext }) => {
  const [userInputs, setUserInputs] = React.useState<string[]>(Array(question.answers.length).fill(''))

  const handleInputChange = (value: string, index: number) => {
    const newInputs = [...userInputs]
    newInputs[index] = value
    setUserInputs(newInputs)
  }

  const renderedText = question.text.split('@@').map((part, index) => (
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
  ))

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>{renderedText}</View>
      <Button title="Next" onPress={onNext} buttonStyle={styles.nextButton} />
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
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
})

export default TextHoleQuestion
