import { CreateExerciceDto, Exercice } from '#domainModels/exercice/exercice'

export interface CreateExerciceUseCase {
  create: (createExerciceDto: CreateExerciceDto) => Promise<Exercice>
}
