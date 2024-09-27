import { IIARepository } from '#quiz/domain/contracts/ia.repository'
import { CreateQuizDto, QuizType } from '#quiz/domain/models/quiz/quiz'
import { QuizFromGpt } from '@world-of-studies/api-types'
import { Id } from '#shared/id/domain/models/id'

export class GptIARepository implements IIARepository {
  async generate(params: any): Promise<CreateQuizDto> {
    const res = await fetch('http://', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(params),
    })

    const data = (await res.json()) as QuizFromGpt

    return {
      name: data.name,
      type: QuizType.PRACTICE,
      subjectId: new Id('1'),
      questions: data.questions.map((q) => {
        if (q.type === 'qcm') {
          return {
            type: 'qcm',
            choices: q.choices,
            points: 1,
          }
        } else if (q.type === 'text-hole') {
          return {
            type: 'text-hole',
            answers: q.answers,
            points: 1,
          }
        }

        throw new Error('error')
      }),
    }
  }
}
