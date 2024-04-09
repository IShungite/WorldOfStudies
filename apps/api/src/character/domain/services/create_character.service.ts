import { Character, CreateCharacterDto } from '../models/character.js'
import { ICharactersRepository } from '../contracts/repositories/characters.repository.js'
import { inject } from '@adonisjs/core'

@inject()
export class CreateCharacterService {
  constructor(private readonly charactersRepository: ICharactersRepository) {}

  async execute(createCharacterDto: CreateCharacterDto): Promise<Character> {
    const character = new Character(createCharacterDto)

    return this.charactersRepository.save(character)
  }
}
