import { User } from '#user/domain/models/user'

export class UserApiMapper {
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
