import { Character, CreateCharacterDto } from '#domainModels/character/character'

export interface CreateCharacterUseCase {
  create: (createCharacterDto: CreateCharacterDto) => Promise<Character>
}
