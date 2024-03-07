type AccessTokenProps = {
  type: string
  token: string
  abilities: string[]
  lastUsedAt?: Date
  expiresAt?: Date
}

export class AccessToken {
  readonly type: string
  readonly token: string
  readonly abilities: string[]
  readonly lastUsedAt: Date | null
  readonly expiresAt: Date | null

  constructor({ type, token, abilities, lastUsedAt, expiresAt }: AccessTokenProps) {
    this.type = type
    this.token = token
    this.abilities = abilities
    this.lastUsedAt = lastUsedAt ?? null
    this.expiresAt = expiresAt ?? null
  }
}
