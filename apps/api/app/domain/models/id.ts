export class Id {
  readonly value: string
  constructor(value: string) {
    this.value = value
  }

  static factory() {
    return new Id(this.generateValue())
  }

  private static generateValue() {
    return String(Math.random())
  }
}
