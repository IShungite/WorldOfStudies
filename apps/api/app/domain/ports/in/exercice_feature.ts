import { Exercice, UpdateExerciceDto } from '../../models/exercice.js'

export interface ExerciceFeature {
  saveExercice: (exercice: Exercice) => Promise<Exercice>
  updateExercice: (exerciceId: string, updateQuizDto: UpdateExerciceDto) => Promise<Exercice>
  getExercice: (exerciceId: string) => Promise<Exercice | null>
  getExercices: () => Promise<Exercice[]>
  deleteExercice: (exerciceId: string) => Promise<void>
}
