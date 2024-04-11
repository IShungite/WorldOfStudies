export class UnauthorizedException extends Error {
  constructor() {
    super("You don't have permission to do this action")
  }
}
