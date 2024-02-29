export class Id {
  constructor(private readonly _value: string) {
    if (!_value) {
      throw new Error('Id cannot be empty')
    }
  }

  static factory() {
    return new Id(this.generateValue())
  }

  private static generateValue() {
    return String(Math.random())
  }

  equals(id: Id) {
    return this._value === id._value
  }

  toString() {
    return this._value
  }
}
