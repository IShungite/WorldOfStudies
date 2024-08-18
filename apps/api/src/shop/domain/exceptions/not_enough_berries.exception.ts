export class NotEnoughBerriesException extends Error {
  constructor(currentBerries: number, requiredBerries: number) {
    super(`Not enough berries. Required: ${requiredBerries}, current: ${currentBerries}`)
  }
}
