import jwt from 'jsonwebtoken'

export class CreateTestJwtService {
  static create(email: string) {
    return jwt.sign({ email }, 'secret')
  }

  static verify(token: string) {
    return jwt.verify(token, 'secret') as { email: string }
  }
}
