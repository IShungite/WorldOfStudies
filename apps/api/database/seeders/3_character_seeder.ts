import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { Id } from '#shared/id/domain/models/id'
import app from '@adonisjs/core/services/app'
import { Character } from '#character/domain/models/character'
import { ICharactersRepository } from '#character/domain/contracts/repositories/characters.repository'

export const characters: Character[] = [
  new Character({
    id: new Id('1'),
    name: 'Pres1',
    promotionId: new Id('1'),
    userId: new Id('2'),
    berries: 98,
    skin: 'default-skin.png',
  }),
  new Character({
    id: new Id('2'),
    name: 'Lutor',
    promotionId: new Id('2'),
    userId: new Id('2'),
    berries: 100,
    skin: 'default-skin.png',
  }),
  new Character({
    id: new Id('3'),
    name: 'Character 3',
    promotionId: new Id('1'),
    userId: new Id('3'),
    berries: 100,
    skin: 'default-skin.png',
  }),
]

export const character1 = characters[0]

export default class extends BaseSeeder {
  async run() {
    const repo = await app.container.make(ICharactersRepository)
    await Promise.all(characters.map((character) => repo.save(character)))
  }
}
