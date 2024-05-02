import { atom } from 'jotai'

export const selectedProductAtom = atom<null | { id: string; name: string; price: number }>(null)
