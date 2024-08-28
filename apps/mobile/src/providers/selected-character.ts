import { CharacterResponse } from '@world-of-studies/api-types/src/character/character_response'
import { atom } from 'jotai'

export const selectedCharacterAtom = atom<CharacterResponse | null>(null)
