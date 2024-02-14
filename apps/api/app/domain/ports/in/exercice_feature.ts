import { CreateExerciceDto, Exercice, UpdateExerciceDto } from '../../models/exercice.js'

export interface ExerciceFeature {
  saveExercice: (createExerciceDto: CreateExerciceDto) => Promise<Exercice>
  updateExercice: (exerciceId: string, updateQuizDto: UpdateExerciceDto) => Promise<Exercice>
  getExercice: (exerciceId: string) => Promise<Exercice | null>
  getExercices: () => Promise<Exercice[]>
}
