import { Id } from '#domain/models/id/id'
import { Role, role } from '#domain/models/user/role'
import { User } from '#domain/models/user/user'

export class UserBuilderTest {
  private _id = Math.floor(Math.random() * 100000).toString()
  private _firstName = 'bou'
  private _lastName = 'bin'
  private _email = `${Math.random().toString(36).substring(2)}@example.com`
  private _password = '123456'
  private _role: Role = role.STUDENT

  build(): User {
    return new User({
      id: new Id(this._id),
      firstName: this._firstName,
      lastName: this._lastName,
      email: this._email,
      password: this._password,
      role: this._role,
    })
  }

  withId(id: string): this {
    this._id = id
    return this
  }

  withFirstName(name: string): this {
    this._firstName = name
    return this
  }

  withLastName(name: string): this {
    this._lastName = name
    return this
  }

  withEmail(email: string): this {
    this._email = email
    return this
  }

  withPassword(password: string): this {
    this._password = password
    return this
  }

  withRole(roleParams: Role): this {
    this._role = roleParams
    return this
  }
}
