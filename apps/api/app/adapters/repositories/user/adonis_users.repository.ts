import { AccessToken } from '#domainModels/user/access_token'
import { User } from '#domainModels/user/user'
import { IUsersRepository } from '#domainPorts/out/user.repository'
import { UserMapper } from '#mappers/user.mapper'
import UserEntity from '#models/user'

export class AdonisUsersRepository implements IUsersRepository {
  async getByEmail(email: string): Promise<User | null> {
    const user = await UserEntity.findBy('email', email)

    if (!user) return null

    return UserMapper.fromAdonisDb(user)
  }

  async createToken(user: User): Promise<AccessToken> {
    const userEntity = await UserEntity.find(user.id.toString())

    if (!userEntity) {
      throw new Error('User not found')
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
      }
    )

    return UserMapper.fromAdonisDb(newUser)
  }

  async verifyCredentials(email: string, password: string): Promise<User> {
    console.log(email, password)
    const user = await UserEntity.verifyCredentials(email, password)
    console.log('good')

    return UserMapper.fromAdonisDb(user)
  }
}
