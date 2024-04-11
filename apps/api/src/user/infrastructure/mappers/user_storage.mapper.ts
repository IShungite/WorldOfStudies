import { User } from '../../domain/models/user.js'
import UserEntity from '../entities/user.js'
import { Id } from '../../../shared/id/domain/models/id.js'

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
