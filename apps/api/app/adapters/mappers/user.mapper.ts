import { Id } from '#domainModels/id'
import { User } from '#domainModels/user'
import UserEntity from '#models/user'

export class UserMapper {
  static fromAdonisDb(user: UserEntity): User {
    return new User({
      id: new Id(user.id.toString()),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      password: user.password,
    })
  }
}
