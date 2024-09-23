import { test } from '@japa/runner'
import { StatusCodes } from 'http-status-codes'

test.group('Subjects - store', () => {
  test('It should return a 422 if the payload is invalid', async ({ client }) => {
    const response = await client.post('/subjects').json({})

    response.assertStatus(StatusCodes.UNPROCESSABLE_ENTITY)
  })

  test('It should create a subject', async ({ client }) => {
    const response = await client.post('/subjects').json({
      name: 'Subject 1',
    })

    response.assertStatus(StatusCodes.CREATED)
    response.assertBodyContains({ name: 'Subject 1' })
  })
})
