import { Id } from '#domainModels/id'
import { Exercice, UpdateExerciceDto } from '../../models/exercice.js'

export interface ExerciceFeature {
  createExercice: (exercice: Exercice) => Promise<Exercice>
  updateExercice: (exerciceId: Id, updateQuizDto: UpdateExerciceDto) => Promise<Exercice>
  getExercice: (exerciceId: Id) => Promise<Exercice | null>
  getExercices: () => Promise<Exercice[]>
  deleteExercice: (exerciceId: Id) => Promise<void>
}
