import { Role } from './role.js'

type AccessTokenProps = {
  type: string
  token: string
  role: Role
  lastUsedAt?: Date
  expiresAt?: Date
}

export class AccessToken {
  readonly type: string
  readonly token: string
  readonly role: Role
  readonly lastUsedAt: Date | null
  readonly expiresAt: Date | null

  constructor({ type, token, role, lastUsedAt, expiresAt }: AccessTokenProps) {
    this.type = type
    this.token = token
    this.role = role
    this.lastUsedAt = lastUsedAt ?? null
    this.expiresAt = expiresAt ?? null
  }
}
