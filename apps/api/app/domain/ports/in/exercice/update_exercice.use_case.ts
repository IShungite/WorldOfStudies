import { UpdateExerciceDto, Exercice } from '#domainModels/exercice/exercice'
import { Id } from '#domainModels/id'

export interface UpdateExerciceUseCase {
  update: (exerciceId: Id, updateQuizDto: UpdateExerciceDto) => Promise<Exercice>
}
