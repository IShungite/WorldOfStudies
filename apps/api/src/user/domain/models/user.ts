import { Id } from '#shared/id/domain/models/id'
import { Role } from '#user/domain/models/role'

export type CreateUserDto = {
  firstName: string
  lastName: string
  email: string
  password: string
}

type UserProps = {
  id?: Id
  firstName: string
  lastName: string
  email: string
  password: string
  role: Role
}

export class User {
  readonly id: Id
  readonly firstName: string
  readonly lastName: string
  readonly email: string
  readonly password: string
  readonly role: Role

  constructor({ id, firstName, lastName, email, password, role }: UserProps) {
    this.id = id ?? Id.factory()
    this.firstName = firstName
    this.lastName = lastName
    this.email = email
    this.password = password
    this.role = role
  }
}
