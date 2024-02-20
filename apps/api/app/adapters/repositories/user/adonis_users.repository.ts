import { User } from '#domainModels/user'
import UserEntity from '#models/user'
import { IUsersRepository } from '#domainPorts/out/user.repository'
import { Id } from '#domainModels/id'

export class AdonisUsersRepository implements IUsersRepository {
  async findByEmail(email: string): Promise<User | null> {
    const user = await UserEntity.find({ email: email })

    if (!user) return null

    return new User({
      id: new Id(user.id.toString()),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      password: user.password,
    })
  }

  async createToken(user: User): Promise<{ type: string; value: string }> {
    const userEntity = await UserEntity.verifyCredentials(user.email, user.password)

    const token = await UserEntity.accessTokens.create(userEntity)

    return {
      type: 'Bearer',
      value: token.value!.release(),
    }
  }

  async store(user: User): Promise<User> {
    const newUser = await UserEntity.updateOrCreate(
      { id: Number.parseInt(user.id.toString(), 10) },
      {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        password: user.password,
      }
    )
    return new User({
      id: new Id(newUser.id.toString()),
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      password: newUser.password,
    })
  }

  async verifyCredentials(email: string, password: string): Promise<User> {
    const user = await UserEntity.verifyCredentials(email, password)

    return new User({
      id: new Id(user.id.toString()),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      password: user.password,
    })
  }
}
