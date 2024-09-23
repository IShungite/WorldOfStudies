import { CreateQuizDto, Quiz, QuizType } from '#quiz/domain/models/quiz/quiz'
import { QuestionFactory } from '#quiz/domain/factories/question.factory'
import { CreateExamQuizDto, ExamQuiz } from '#quiz/domain/models/quiz/exam_quiz'
import { PracticeQuiz } from '#quiz/domain/models/quiz/practice_quiz'

export class QuizFactory {
  static create(createQuiz: CreateQuizDto): Quiz {
    const questions = createQuiz.questions.map((question) => QuestionFactory.create(question))

    if (isCreateExamQuizDto(createQuiz)) {
      return new ExamQuiz({
        ...createQuiz,
        questions,
      })
    }

    return new PracticeQuiz({
      ...createQuiz,
      questions,
    })
  }
}

const isCreateExamQuizDto = (createQuiz: CreateQuizDto): createQuiz is CreateExamQuizDto => {
  return createQuiz.type === QuizType.EXAM
}
