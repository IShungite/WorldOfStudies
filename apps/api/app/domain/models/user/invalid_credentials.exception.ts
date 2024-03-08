export class InvalidCredentialsException extends Error {
  constructor() {
    super('Invalid credentials')
  }
}
