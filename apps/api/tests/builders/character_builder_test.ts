import { Id } from '#shared/id/domain/models/id'
import { Character } from '#character/domain/models/character'
import { User } from '#user/domain/models/user'
import { Promotion } from '#school/domain/models/promotion'

export class CharacterBuilderTest {
  private _id = Id.factory()
  private _name = 'bou'
  private _userId = Id.factory()
  private _promotionId = Id.factory()

  build(): Character {
    return new Character({
      id: this._id,
      name: this._name,
      userId: this._userId,
      promotionId: this._promotionId,
    })
  }

  withId(id: string): this {
    this._id = new Id(id)
    return this
  }

  withName(name: string): this {
    this._name = name
    return this
  }

  withUser(user: User): this {
    this._userId = user.id
    return this
  }

  withPromotionId(promotion: Promotion): this {
    this._promotionId = promotion.id
    return this
  }
}
