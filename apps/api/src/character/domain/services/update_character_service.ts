import { ICharactersRepository } from '../contracts/repositories/characters.repository.js'
import { Id } from '../../../shared/id/domain/models/id.js'
import { Character, UpdateCharacterDto } from '../models/character.js'
import { CharacterNotFoundException } from '../models/character_not_found.exception.js'
import { inject } from '@adonisjs/core'
import { User } from '../../../user/domain/models/user.js'
import { UnauthorizedException } from '../../../shared/exceptions/unauthorized.exception'

@inject()
export class UpdateCharacterService {
  constructor(readonly charactersRepository: ICharactersRepository) {}

  private async validate(characterId: Id, user?: User) {
    const character = await this.charactersRepository.getById(characterId)

    if (!character) {
      throw new CharacterNotFoundException(characterId)
    }

    if (user && !character.userId.equals(user.id)) {
      throw new UnauthorizedException()
    }

    return character
  }

  async execute(
    characterId: Id,
    updateCharacterDto: UpdateCharacterDto,
    user?: User
  ): Promise<Character> {
    const character = await this.validate(characterId, user)

    const newCharacter = new Character({
      id: character.id,
      name: updateCharacterDto.name ?? character.name,
      userId: character.userId,
    })

    return this.charactersRepository.save(newCharacter)
  }
}
