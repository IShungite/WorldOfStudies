import { TextHoleQuestionResponse } from '@world-of-studies/api-types/src/quizzes'
import { QuestionType } from '@world-of-studies/api-types/src/quizzes/question'
import { QuestionTextHole } from '@world-of-studies/api-types/src/quizzes/text-hole-question'
import { UserAnswerDtoTextHole } from '@world-of-studies/api-types/src/quizzes/user-answers'
import React, { useState, useEffect } from 'react'
import { StyleSheet, TextInput, View } from 'react-native'

import Button from '@/components/shared/Button'
import Container from '@/components/shared/Container'
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
    setUserInputs((prev) => {
      const values = [...prev]
      values[index] = value

      return values
    })
  }

  const isAnswerComplete = userInputs.every((input) => input.trim() !== '') // Check if all inputs are filled

  const handleSubmit = async () => {
    if (isAnswerComplete) {
      console.log(userInputs)
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
      <View style={styles.mapContainer}>
        {textSplit.map((part, index) => (
          <React.Fragment key={part}>
            {part.split(' ').map((word, index) => (
              <View key={`${word}-${index}`}>
                <Text style={styles.part}>{`${word} `}</Text>
              </View>
            ))}
            {index < inputsNb && (
              <TextInput
                placeholder="..."
                value={userInputs[index]}
                onChangeText={(value) => handleInputChange(value, index)}
                style={{
                  color: '#fff',
                  backgroundColor: '#000',
                  opacity: 0.4,
                  borderRadius: 5,
                  width: 60,
                  fontSize: 16,
                  fontWeight: 'bold',
                  textAlignVertical: 'top',
                  marginBottom: 2,
                  marginRight: 4,
                }}
              />
            )}
          </React.Fragment>
        ))}
      </View>

      <Button
        title="Suivant"
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
  mapContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  input: {
    width: 120,
    color: '#fff',
    margin: 0,
    padding: 0,
    lineHeight: 0,
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
