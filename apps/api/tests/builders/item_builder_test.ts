import { Id } from '#shared/id/domain/models/id'
import { ItemType } from '#shared/enums/item_type'
import { Item } from '#item/domain/models/item'

export class ItemBuilderTest {
  private _id = Id.factory()
  private _name = 'item'
  private _type = ItemType.Misc
  private _image = 'les-de.png'
  private _icon = 'les-de.png'

  build(): Item {
    return new Item({
      id: this._id,
      name: this._name,
      type: this._type,
      image: this._image,
      icon: this._icon,
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

  withType(type: ItemType): this {
    this._type = type
    return this
  }

  withImage(image: string): this {
    this._image = image
    return this
  }

  withIcon(icon: string): this {
    this._icon = icon
    return this
  }
}
