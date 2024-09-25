import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { Id } from '#shared/id/domain/models/id'
import app from '@adonisjs/core/services/app'
import { IShopsRepository } from '#shop/domain/contracts/repositories/shops.repository'
import { Shop } from '#shop/domain/models/shop'
import { ShopCategory } from '#shop/domain/models/shop_category'
import { ShopProduct } from '#shop/domain/models/shop_product'
import { Price } from '#shop/domain/models/price'
import { items } from '#database/seeders/1_item_seeder'

export default class extends BaseSeeder {
  async run() {
    const repo = await app.container.make(IShopsRepository)

    const shops: Shop[] = [
      new Shop({
        id: new Id('1'),
        schoolId: new Id('1'),
        categories: [
          new ShopCategory({
            id: new Id('1'),
            name: 'Category 1-1',
            products: [
              new ShopProduct({
                id: new Id('1'),
                item: items[1],
                price: new Price(100),
              }),
              new ShopProduct({
                id: new Id('2'),
                item: items[2],
                price: new Price(200),
              }),
              new ShopProduct({
                id: new Id('3'),
                item: items[3],
                price: new Price(300),
              }),
              new ShopProduct({
                id: new Id('4'),
                item: items[4],
                price: new Price(400),
              }),
              new ShopProduct({
                id: new Id('5'),
                item: items[5],
                price: new Price(500),
              }),
            ],
          }),
          new ShopCategory({
            id: new Id('2'),
            name: 'Category 1-2',
            products: [
              new ShopProduct({
                id: new Id('6'),
                item: items[2],
                price: new Price(150),
              }),
              new ShopProduct({
                id: new Id('7'),
                item: items[7],
                price: new Price(250),
              }),
            ],
          }),
        ],
      }),
    ]
    await Promise.all(shops.map((shop) => repo.save(shop)))
  }
}
