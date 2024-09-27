import { CreateQuizDto } from '#quiz/domain/models/quiz/quiz'

export abstract class IIARepository {
  abstract generate(params: any): Promise<CreateQuizDto>
}
