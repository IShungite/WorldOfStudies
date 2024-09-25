import { Character } from '#character/domain/models/character'
import type { CharacterListResponse, CharacterResponse } from '@world-of-studies/api-types'
import { School } from '#school/domain/models/school'

export class CharacterApiMapper {
  static toResponse(character: Character, school: School): CharacterResponse {
    return {
      result: {
        id: character.id.toString(),
        name: character.name,
        userId: character.userId.toString(),
        berries: character.berries,
        skin: character.skin,
        schoolId: school.id.toString(),
        schoolName: school.name,
        promotionName:
          school.promotions.find(({ id }) => id.equals(character.promotionId))?.name ?? '',
      },
    }
  }

  static toResponseList(characters: Character[], schools: School[]): CharacterListResponse {
    const schoolsByCharacterIds = characters.reduce(
      (acc, character) => {
        const school = schools.find((schoolToFind) =>
          schoolToFind.promotions.find(({ id }) => id.equals(character.promotionId))
        )
        if (!school) {
          throw new Error('school not found')
        }

        acc[character.id.toString()] = school
        return acc
      },
      {} as Record<string, School>
    )

    return {
      results: characters.map((character) => ({
        result: {
          ...this.toResponse(character, schoolsByCharacterIds[character.id.toString()]).result,
        },
      })),
    }
  }
}
