import { atom } from 'jotai'

export const selectedCharacterAtom = atom<null | { name: string }>(null)
