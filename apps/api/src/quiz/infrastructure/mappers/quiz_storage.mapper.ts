import { Id } from '#shared/id/domain/models/id'
import { QuestionStorageMapper } from '#quiz/infrastructure/mappers/question_storage.mapper'
import { Quiz, QuizType } from '#quiz/domain/models/quiz/quiz'
import QuizEntity from '#quiz/infrastructure/entities/quiz'
import { ExamQuiz } from '#quiz/domain/models/quiz/exam_quiz'
import { PracticeQuiz } from '#quiz/domain/models/quiz/practice_quiz'

export class QuizStorageMapper {
  static fromLucid(quizEntity: QuizEntity): Quiz {
    if (quizEntity.type === QuizType.EXAM) {
      return new ExamQuiz({
        id: new Id(quizEntity.id.toString()),
        name: quizEntity.name,
        questions: quizEntity.questions.map((question) =>
          QuestionStorageMapper.fromLucid(question)
        ),
        subjectId: new Id(quizEntity.subjectId.toString()),
        startAt: quizEntity.startAt!.toJSDate(),
        endAt: quizEntity.endAt!.toJSDate(),
      })
    }

    return new PracticeQuiz({
      id: new Id(quizEntity.id.toString()),
      name: quizEntity.name,
      questions: quizEntity.questions.map((question) => QuestionStorageMapper.fromLucid(question)),
      subjectId: new Id(quizEntity.subjectId.toString()),
    })
  }
}
