import { Character, CreateCharacterDto } from '#domainModels/character/character'
import { ICharactersRepository } from '#domainPorts/out/characters.repository'
import { inject } from '@adonisjs/core'

@inject()
export class CreateCharacterService {
  constructor(private readonly charactersRepository: ICharactersRepository) {}

  async execute(createCharacterDto: CreateCharacterDto): Promise<Character> {
    const character = new Character(createCharacterDto)

    return this.charactersRepository.save(character)
  }
}
