import { Character, CreateCharacterDto } from '#domainModels/character'
import { CreateCharacterUseCase } from '#domainPorts/in/character/create_character.use_case'
import { ICharactersRepository } from '#domainPorts/out/characters.repository'
import { inject } from '@adonisjs/core'

@inject()
export class CreateCharacterService implements CreateCharacterUseCase {
  constructor(private readonly charactersRepository: ICharactersRepository) {}

  async create(createCharacterDto: CreateCharacterDto): Promise<Character> {
    const character = new Character(createCharacterDto)

    return this.charactersRepository.save(character)
  }
}
