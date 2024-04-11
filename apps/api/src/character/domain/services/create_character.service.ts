import { inject } from '@adonisjs/core'
import { ICharactersRepository } from '#character/domain/contracts/repositories/characters.repository'
import { Character, CreateCharacterDto } from '#character/domain/models/character'

@inject()
export class CreateCharacterService {
  constructor(private readonly charactersRepository: ICharactersRepository) {}

  async execute(createCharacterDto: CreateCharacterDto): Promise<Character> {
    const character = new Character(createCharacterDto)

    return this.charactersRepository.save(character)
  }
}
