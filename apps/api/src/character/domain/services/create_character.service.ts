import { inject } from '@adonisjs/core'
import { ICharactersRepository } from '#character/domain/contracts/repositories/characters.repository'
import { Character, CreateCharacterDto } from '#character/domain/models/character'
import { ISchoolsRepository } from '#school/domain/contracts/repositories/schools.repository'
import { PromotionNotFoundException } from '#school/domain/models/promotion_not_found.exception'
import { CreateInventoryForCharacterService } from '#inventory/domain/services/create_inventory_for_character.service'

@inject()
export class CreateCharacterService {
  constructor(
    private readonly charactersRepository: ICharactersRepository,
    private readonly schoolsRepository: ISchoolsRepository,
    private readonly createInventoryForCharacter: CreateInventoryForCharacterService
  ) {}

  async execute(createCharacterDto: CreateCharacterDto): Promise<Character> {
    await this.validate(createCharacterDto)

    const character = new Character({
      ...createCharacterDto,
      berries: 0,
    })

    await this.charactersRepository.save(character)

    await this.createInventoryForCharacter.execute(character.id)

    return character
  }

  private async validate(createCharacterDto: CreateCharacterDto) {
    const school = await this.schoolsRepository.getByPromotionId(createCharacterDto.promotionId)
    if (!school) {
      throw new PromotionNotFoundException(createCharacterDto.promotionId)
    }
  }
}
