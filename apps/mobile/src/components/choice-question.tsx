import { QuestionType } from '@world-of-studies/api-types/src/quizzes'
import { QuestionQcm } from '@world-of-studies/api-types/src/quizzes/qcm-question'
import { UserAnswerDtoQcm } from '@world-of-studies/api-types/src/quizzes/user-answers'
import React, { useState, useEffect } from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'

import Button from '@/components/shared/Button'
import GradientContainer from '@/components/shared/GradientContainer'
import Text from '@/components/shared/Text'

type Props = {
  question: QuestionQcm
  onNext: () => void
  handleSubmitAnswer: (questionId: string, answer: UserAnswerDtoQcm) => void
}

const ChoiceQuestion: React.FC<Props> = ({ question, onNext, handleSubmitAnswer }) => {
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null)

  useEffect(() => {
    setSelectedChoiceId(null)
    console.log('question', question)
  }, [question.id])

  const handleChoiceSelect = (choiceId: string) => {
    setSelectedChoiceId(choiceId)
  }

  const handleNext = () => {
    if (selectedChoiceId) {
      handleSubmitAnswer(question.id, {
        type: QuestionType.QCM,
        choiceId: selectedChoiceId,
      })
      onNext()
    }
  }

  return (
    <>
      <Text style={styles.questionText}>{question.text}</Text>
      <GradientContainer>
        <Text style={styles.instructionText}>Select the correct option(s):</Text>

        {question.choices ? (
          question.choices.map((choice) => (
            <TouchableOpacity
              key={choice.id}
              style={[
                styles.choiceButton,
                selectedChoiceId === choice.id ? styles.selectedChoice : styles.unselectedChoice,
              ]}
              onPress={() => handleChoiceSelect(choice.id)}
            >
              <Text style={styles.choiceText}>{choice.label}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.errorText}>No choices available.</Text>
        )}
        <Button
          title="Next"
          onPress={handleNext}
          color={selectedChoiceId ? 'green' : 'gray'}
          style={[styles.nextButton, !selectedChoiceId && styles.inactiveButton]}
        />
      </GradientContainer>
    </>
  )
}

const styles = StyleSheet.create({
  choiceButton: {
    width: '100%',
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
    alignItems: 'center',
  },
  selectedChoice: {
    backgroundColor: '#2196f3',
  },
  unselectedChoice: {
    backgroundColor: '#d3d3d3',
  },
  choiceText: {
    fontSize: 16,
  },
  questionText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
  instructionText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  nextButton: {
    marginTop: 20,
  },
  inactiveButton: {
    opacity: 0.6,
  },
})

export default ChoiceQuestion
