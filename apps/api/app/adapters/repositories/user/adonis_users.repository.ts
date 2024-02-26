import { User } from '#domainModels/user'
import { IUsersRepository } from '#domainPorts/out/user.repository'
import { UserMapper } from '#mappers/user.mapper'
import UserEntity from '#models/user'

export class AdonisUsersRepository implements IUsersRepository {
  async getByEmail(email: string): Promise<User | null> {
    const user = await UserEntity.find({ email: email })

    if (!user) return null

    return UserMapper.fromAdonisDb(user)
  }

  async createToken(user: User): Promise<{ type: string; value: string }> {
    const userEntity = await UserEntity.verifyCredentials(user.email, user.password)

    const token = await UserEntity.accessTokens.create(userEntity)

    return {
      type: 'Bearer',
      value: token.value!.release(),
    }
  }

  async create(user: User): Promise<User> {
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
    const user = await UserEntity.verifyCredentials(email, password)

    return UserMapper.fromAdonisDb(user)
  }
}
