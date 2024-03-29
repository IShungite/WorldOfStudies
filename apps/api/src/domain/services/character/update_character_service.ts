import { ICharactersRepository } from '#domain/contracts/repositories/characters.repository'
import { Id } from '#domain/models/id/id'
import { Character, UpdateCharacterDto } from '#domain/models/character/character'
import { CharacterNotFoundException } from '#domain/models/character/character_not_found.exception'
import { inject } from '@adonisjs/core'
import { User } from '#domain/models/user/user'
import { UnauthorizedException } from '#domain/models/exceptions/unauthorized.exception'

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
