import { InvalidPriceException } from './invalid_price.exception.js'

export class Price {
  constructor(private readonly value: number) {
    if (value < 0) {
      throw new InvalidPriceException('Price cannot be negative')
    }
  }

  toNumber() {
    return this.value
  }
}
