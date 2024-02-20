import { CreateExerciceDto, Exercice } from '#domainModels/exercice'
import { QuestionFactory } from './question_factory.js'

export class ExerciceFactory {
  static create(createExercice: CreateExerciceDto): Exercice {
    const questions = createExercice.questions.map((question) => QuestionFactory.create(question))

    const exercice = new Exercice({
      ...createExercice,
      questions,
    })

    return exercice
  }
}
