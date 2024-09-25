import { Input } from '@rneui/base'
import { QuestionType } from '@world-of-studies/api-types/src/quizzes/question'
import { QuestionTextHole } from '@world-of-studies/api-types/src/quizzes/text-hole-question'
import { UserAnswerDtoTextHole } from '@world-of-studies/api-types/src/quizzes/user-answers'
import React, { useState, useEffect } from 'react'
import { StyleSheet } from 'react-native'

import Button from '@/components/shared/Button'
import GradientContainer from '@/components/shared/GradientContainer'
import Text from '@/components/shared/Text'

type Props = {
  question: QuestionTextHole
  onNext: () => void
  handleSubmitAnswer: (questionId: string, answer: UserAnswerDtoTextHole) => Promise<void>
}

const TextHoleQuestion: React.FC<Props> = ({ question, onNext, handleSubmitAnswer }) => {
  const [userInputs, setUserInputs] = useState<string[]>([])

  // Reset inputs when the question changes
  useEffect(() => {
    setUserInputs([])
  }, [question.id])

  const handleInputChange = (value: string, index: number) => {
    setUserInputs((prev) => prev.map((input, i) => (i === index ? value : input)))
  }

  const isAnswerComplete = userInputs.every((input) => input.trim() !== '') // Check if all inputs are filled

  const handleSubmit = async () => {
    if (isAnswerComplete) {
      await handleSubmitAnswer(question.id, {
        type: QuestionType.TEXT_HOLE,
        values: userInputs,
      })
      onNext()
    }
  }

  const textSplit = question.text.split('@@')
  const inputsNb = textSplit.length - 1

  return (
    <GradientContainer style={styles.textholeContainer}>
      {textSplit.map((part, index) => (
        <React.Fragment key={part}>
          <Text style={styles.part}>{part}</Text>
          {index < inputsNb && (
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
