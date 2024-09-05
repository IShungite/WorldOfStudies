import { Character } from '@world-of-studies/api-types/src/character/character'
import { atom } from 'jotai'

export const selectedCharacterAtom = atom<Character | null>(null)
