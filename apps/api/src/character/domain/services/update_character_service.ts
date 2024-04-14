import { inject } from '@adonisjs/core'
import { ICharactersRepository } from '#character/domain/contracts/repositories/characters.repository'
import { Id } from '#shared/id/domain/models/id'
import { CharacterNotFoundException } from '#character/domain/models/character_not_found.exception'
import { UnauthorizedException } from '#shared/domain/exceptions/unauthorized.exception'
import { Character, UpdateCharacterDto } from '#character/domain/models/character'
import { User } from '#user/domain/models/user'

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
      ...character,
      name: updateCharacterDto.name ?? character.name,
    })

    return this.charactersRepository.save(newCharacter)
  }
}
