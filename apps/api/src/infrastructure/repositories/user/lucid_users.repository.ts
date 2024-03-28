import { AccessToken } from '#domain/models/user/access_token'
import { User } from '#domain/models/user/user'
import { UserNotFoundException } from '#domain/models/user/user_not_found.exception'
import { IUsersRepository } from '#domain/contracts/repositories/users.repository'
import { UserMapper } from '#infrastructure/mappers/user.mapper'
import UserEntity from '#infrastructure/entities/user'
import testUtils from '@adonisjs/core/services/test_utils'
import { InvalidCredentialsException } from '#domain/models/user/invalid_credentials.exception'

export class LucidUsersRepository implements IUsersRepository {
  async getByEmail(email: string): Promise<User | null> {
    const user = await UserEntity.findBy('email', email)

    if (!user) return null

    return UserMapper.fromLucid(user)
  }

  async createToken(user: User): Promise<AccessToken> {
    const userEntity = await UserEntity.find(user.id.toString())

    if (!userEntity) {
      throw new UserNotFoundException(user.id)
    }

    const token = await UserEntity.accessTokens.create(userEntity)

    return new AccessToken({
      type: 'auth_token',
      token: token.value!.release(),
      role: user.role,
    })
  }

  async save(user: User): Promise<User> {
    const newUser = await UserEntity.updateOrCreate(
      { id: Number.parseInt(user.id.toString(), 10) },
      {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        password: user.password,
        role: user.role,
      }
    )

    return UserMapper.fromLucid(newUser)
  }

  async verifyCredentials(email: string, password: string): Promise<User> {
    try {
      const user = await UserEntity.verifyCredentials(email, password)

      return UserMapper.fromLucid(user)
    } catch (e) {
      throw new InvalidCredentialsException()
    }
  }

  async empty(): Promise<void> {
    await testUtils
      .db()
      .truncate()
      .then((trunc) => trunc())
  }
}
