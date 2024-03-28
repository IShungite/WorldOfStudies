import { Id } from '#domain/models/id/id'
import { User } from '#domain/models/user/user'
import UserEntity from '#infrastructure/models/user'

export class UserMapper {
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

  static toResponse(user: User) {
    return {
      id: user.id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    }
  }
}
