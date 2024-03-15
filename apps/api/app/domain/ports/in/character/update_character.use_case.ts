import { Character, CreateCharacterDto } from '#domainModels/character/character'
import { Id } from '#domainModels/id/id'

export interface UpdateCharacterUseCase {
  update: (id: Id, updateCharacterDto: CreateCharacterDto) => Promise<Character>
}
