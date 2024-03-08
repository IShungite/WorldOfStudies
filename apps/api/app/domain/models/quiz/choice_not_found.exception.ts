export class ChoiceNotFoundException extends Error {
  constructor() {
    super('Choice not found')
  }
}
