import { EmptyIdException } from '#shared/id/domain/models/empty_id.exception'

export class Id {
  constructor(private readonly _value: string) {
    if (!_value) {
      throw new EmptyIdException()
    }
  }

  static factory() {
    return new Id(this.generateValue())
  }

  private static generateValue() {
    return Math.floor(Math.random() * 10000).toString()
  }

  equals(id: Id) {
    return this._value === id._value
  }

  toString() {
    return this._value
  }
}
