import { Character, CreateCharacterDto } from '#domainModels/character'

export interface CreateCharacterUseCase {
  create: (createCharacterDto: CreateCharacterDto) => Promise<Character>
}
