import { ICharactersRepository } from '#character/domain/contracts/repositories/characters.repository'
import { Character } from '#character/domain/models/character'
import { CharacterNotFoundException } from '#character/domain/models/character_not_found.exception'
import { IQuizzesInstanceRepository } from '#quiz/domain/contracts/quizzes_instance.repository'
import { ISubjectsRepository } from '#school/domain/contracts/repositories/subjects.repository'
import { Id } from '#shared/id/domain/models/id'
import { inject } from '@adonisjs/core'
import { CharacterStat, QuizStat, SubjectStat } from '@world-of-studies/api-types'

@inject()
export default class GetCharacterStatsService {
  constructor(
    private readonly characterRepository: ICharactersRepository,
    private readonly quizzesInstanceRepository: IQuizzesInstanceRepository,
    private readonly subjectsRepository: ISubjectsRepository
  ) {}

  async execute(characterId: Id, userId: Id): Promise<CharacterStat> {
    const character = await this.validate(characterId, userId)

    const subjects = await this.subjectsRepository.getByPromotionId(character.promotionId)

    const quizzes = await this.quizzesInstanceRepository.getQuizzesByCharacterId(characterId)

    const subjectsStats: SubjectStat[] = subjects.map((subject) => {
      const quizzesInSubject = quizzes.filter((quiz) => quiz.quiz.subjectId.equals(subject.id))

      const quizStats: QuizStat[] = quizzesInSubject.map((quiz) => quiz.getStats())

      const average =
        quizStats.length === 0
          ? null
          : Number.parseFloat(
              (quizStats.reduce((acc, quiz) => acc + quiz.score, 0) / quizStats.length).toPrecision(
                2
              )
            ) || 0

      return {
        name: subject.name,
        average: average,
        quizzes: quizStats,
      }
    })

    const subjectsStatsWithoutNull = subjectsStats.filter(
      (subjectStats) => subjectStats.average !== null
    )

    const characterStats: CharacterStat = {
      subjects: subjectsStats,
      generalAverage:
        Number.parseFloat(
          (
            subjectsStatsWithoutNull.reduce((acc, subject) => acc + subject.average!, 0) /
            subjectsStatsWithoutNull.length
          ).toPrecision(2)
        ) || 0,
    }

    return characterStats
  }

  async validate(characterId: Id, userId: Id): Promise<Character> {
    const character = await this.characterRepository.getById(characterId)
    if (!character) {
      throw new CharacterNotFoundException(characterId)
    }

    if (!character.userId.equals(userId)) {
      throw new CharacterNotFoundException(characterId)
    }

    return character
  }
}
