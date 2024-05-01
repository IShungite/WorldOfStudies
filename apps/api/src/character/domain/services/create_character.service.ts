import { inject } from '@adonisjs/core'
import { ICharactersRepository } from '#character/domain/contracts/repositories/characters.repository'
import { Character, CreateCharacterDto } from '#character/domain/models/character'
import { ISchoolsRepository } from '#school/domain/contracts/repositories/schools.repository'
import { PromotionNotFoundException } from '#school/domain/models/promotion_not_found.exception'

@inject()
export class CreateCharacterService {
  constructor(
    private readonly charactersRepository: ICharactersRepository,
    private readonly schoolsRepository: ISchoolsRepository
  ) {}

  async execute(createCharacterDto: CreateCharacterDto): Promise<Character> {
    await this.validate(createCharacterDto)

    const character = new Character(createCharacterDto)

    return this.charactersRepository.save(character)
  }

  private async validate(createCharacterDto: CreateCharacterDto) {
    const school = await this.schoolsRepository.getByPromotionId(createCharacterDto.promotionId)
    if (!school) {
      throw new PromotionNotFoundException(createCharacterDto.promotionId)
    }
  }
}
