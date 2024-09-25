export class QuizNotYetAvailableException extends Error {
  constructor(startAt: Date) {
    super(`Quiz not yet available, starts at ${startAt.toString()}}`)
  }
}
