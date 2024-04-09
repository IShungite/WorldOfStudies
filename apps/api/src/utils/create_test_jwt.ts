import jwt from 'jsonwebtoken'

export class CreateTestJwtService {
  static create(email: string) {
    return jwt.sign({ email }, 'secret')
  }

  static verify(token: string) {
    const decoded = jwt.verify(token, 'secret')

    if (!decoded) return null

    return decoded as { email: string }
  }
}
