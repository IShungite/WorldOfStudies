import { Character, CreateCharacterDto } from '#domain/models/character/character'
import { ICharactersRepository } from '#domain/contracts/repositories/characters.repository'
import { inject } from '@adonisjs/core'

@inject()
export class CreateCharacterService {
  constructor(private readonly charactersRepository: ICharactersRepository) {}

  async execute(createCharacterDto: CreateCharacterDto): Promise<Character> {
    const character = new Character(createCharacterDto)

    return this.charactersRepository.save(character)
  }
}
