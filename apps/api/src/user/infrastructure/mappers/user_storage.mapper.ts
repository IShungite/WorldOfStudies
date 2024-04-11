import { Id } from '#shared/id/domain/models/id'
import { User } from '#user/domain/models/user'
import UserEntity from '#user/infrastructure/entities/user'

export class UserStorageMapper {
  static fromLucid(user: UserEntity): User {
    return new User({
      id: new Id(user.id.toString()),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      password: user.password,
      role: user.role,
    })
  }
}
