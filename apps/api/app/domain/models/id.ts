export class Id {
  constructor(private readonly _value: string) {}

  static factory() {
    return new Id(this.generateValue())
  }

  private static generateValue() {
    return String(Math.random())
  }

  toString() {
    return this._value
  }
}
