import { Exercice } from '#domainModels/exercice/exercice'
import { IExercicesRepository } from '#domainPorts/out/exercices.repository'
import { InMemoryExercicesRepository } from '#repositories/in_memory_exercices.repository'
import app from '@adonisjs/core/services/app'
import { test } from '@japa/runner'

test.group('Exercices Controller', (group) => {
  let exercicesRepository: IExercicesRepository

  group.each.setup(async () => {
    exercicesRepository = new InMemoryExercicesRepository()
    app.container.swap(IExercicesRepository, () => {
      return exercicesRepository
    })
  })

  test('It should create an exercice', async ({ client }) => {
    const response = await client.post('/exercices').json({
      name: 'Quiz 1',
      questions: [],
    })
    response.assertStatus(201)
    response.assertBodyContains({ name: 'Quiz 1' })
  })

  test('It should return the list of exercices', async ({ client, assert }) => {
    exercicesRepository.store(new Exercice({ name: 'Quiz 1', questions: [] }))
    exercicesRepository.store(new Exercice({ name: 'Quiz 2', questions: [] }))

    const response = await client.get('/exercices')
    response.assertStatus(200)
    assert.lengthOf(response.body(), 2)
  })
})
