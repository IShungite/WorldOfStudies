type UserProps = {
  id: string
  firstName: string
  lastName: string
  email: string
  password: string
}

export class User {
  readonly id: string
  readonly firstName: string
  readonly lastName: string
  readonly email: string
  readonly password: string

  constructor({ id, firstName, lastName, email, password }: UserProps) {
    this.id = id
    this.firstName = firstName
    this.lastName = lastName
    this.email = email
    this.password = password
  }
}
