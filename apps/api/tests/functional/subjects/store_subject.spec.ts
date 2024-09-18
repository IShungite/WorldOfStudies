import { test } from '@japa/runner'
import { StatusCodes } from 'http-status-codes'
import createRepositories from '#tests/utils/create_repositories'
import emptyRepositories from '#tests/utils/empty_repositories'
import { ISchoolsRepository } from '#school/domain/contracts/repositories/schools.repository'
import { Id } from '#shared/id/domain/models/id'
import { School } from '#school/domain/models/school'
import { Promotion } from '#school/domain/models/promotion'

test.group('Subjects - store', (group) => {
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
