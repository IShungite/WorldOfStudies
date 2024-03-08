export class EmptyIdException extends Error {
  constructor() {
    super('Id cannot be empty')
  }
}
