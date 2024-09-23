export class OnlyOneAttemptPerExamQuizException extends Error {
  constructor() {
    super(`You already have completed this exam`)
  }
}
