import { Input } from '@rneui/base'
import { QuestionTextHole } from '@world-of-studies/api-types/src/quizzes/text-hole-question'
import React, { useState, useEffect } from 'react'
import { StyleSheet } from 'react-native'

import Button from '@/components/shared/Button'
import GradientContainer from '@/components/shared/GradientContainer'
import Text from '@/components/shared/Text'

type Props = {
  question: QuestionTextHole
  onNext: () => void
  handleSubmitAnswer: (questionId: string, answer: string[]) => void
}

const TextHoleQuestion: React.FC<Props> = ({ question, onNext, handleSubmitAnswer }) => {
  const [userInputs, setUserInputs] = useState<string[]>(Array(question.answers.length).fill(''))

  // Reset inputs when the question changes
  useEffect(() => {
    setUserInputs(Array(question.answers.length).fill(''))
  }, [question.id])

  const handleInputChange = (value: string, index: number) => {
    const newInputs = [...userInputs]
    newInputs[index] = value
    setUserInputs(newInputs)
  }

  const isAnswerComplete = userInputs.every((input) => input.trim() !== '') // Check if all inputs are filled

  const handleSubmit = () => {
    if (isAnswerComplete) {
      handleSubmitAnswer(question.id, userInputs)
      onNext()
    }
  }

  return (
    <GradientContainer style={styles.textholeContainer}>
      {question.text.split('@@').map((part, index) => (
        <React.Fragment key={index}>
          <Text style={styles.part}>{part}</Text>
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
      <Button
        title="Next"
        onPress={handleSubmit}
        color={isAnswerComplete ? 'green' : 'gray'}
        style={[styles.nextButton, !isAnswerComplete && styles.inactiveButton]}
      />
    </GradientContainer>
  )
}

const styles = StyleSheet.create({
  textholeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    color: '#fff',
    justifyContent: 'center',
  },
  input: {
    width: 50,
    color: '#fff',
    marginHorizontal: 5,
  },
  nextButton: {
    marginTop: 20,
  },
  inactiveButton: {
    opacity: 0.6,
  },
  part: {
    color: '#fff',
  },
})

export default TextHoleQuestion
