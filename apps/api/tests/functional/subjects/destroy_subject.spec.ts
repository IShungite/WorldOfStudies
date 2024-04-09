import { Id } from '../../../src/shared/id/domain/models/id.js'
import { Promotion } from '../../../src/school/domain/models/promotion.js'
import { PromotionNotFoundException } from '../../../src/school/domain/models/promotion_not_found.exception.js'
import { School } from '../../../src/school/domain/models/school.js'
import { SchoolNotFoundException } from '../../../src/school/domain/models/school_not_found.exception.js'
import { Subject } from '../../../src/school/domain/models/subject.js'
import { SubjectNotFoundException } from '../../../src/school/domain/models/subject_not_found.exception.js'
import { ISchoolsRepository } from '../../../src/school/domain/contracts/repositories/schools.repository.js'
import { test } from '@japa/runner'
import { StatusCodes } from 'http-status-codes'
import createRepositories from '#tests/utils/create_repositories'
import emptyRepositories from '#tests/utils/empty_repositories'

test.group('Subjects - destroy', (group) => {
  let schoolsRepository: ISchoolsRepository

  group.setup(async () => {
    ;[schoolsRepository] = await createRepositories([ISchoolsRepository])
  })

  group.each.setup(async () => {
    await emptyRepositories([schoolsRepository])
  })

  test('It should return a 404 if one or more params are not a number', async ({ client }) => {
    const response = await client.delete('/schools/1/promotions/1/subjects/bob')

    response.assertStatus(StatusCodes.NOT_FOUND)
  })

  test('It should return an exception if the school does not exist', async ({ client }) => {
    const id = new Id('1')
    const response = await client.delete(`/schools/${id.toString()}/promotions/1/subjects/1`)

    response.assertStatus(StatusCodes.BAD_REQUEST)
    response.assertTextIncludes(new SchoolNotFoundException(id).message)
  })

  test('It should return an exception if the promotion does not exist', async ({ client }) => {
    const school = new School({ name: 'School 1', promotions: [] })
    const id = new Id('1')

    await schoolsRepository.save(school)

    const response = await client.delete(
      `/schools/${school.id.toString()}/promotions/${id.toString()}/subjects/1`
    )

    response.assertStatus(StatusCodes.BAD_REQUEST)
    response.assertTextIncludes(new PromotionNotFoundException(id).message)
  })

  test('It should return an exception if the subject does not exist', async ({ client }) => {
    const promotion = new Promotion({ name: 'Promotion 1', year: 2022 })
    const school = new School({ name: 'School 1', promotions: [promotion] })
    const id = new Id('1')

    await schoolsRepository.save(school)

    const response = await client.delete(
      `/schools/${school.id.toString()}/promotions/${promotion.id.toString()}/subjects/${id.toString()}`
    )

    response.assertStatus(StatusCodes.BAD_REQUEST)
    response.assertTextIncludes(new SubjectNotFoundException(id).message)
  })

  test('It should destroy a subject', async ({ client }) => {
    const subject = new Subject({ name: 'Subject 1' })
    const promotion = new Promotion({
      name: 'Promotion 1',
      year: 2022,
      subjects: [subject],
    })
    const school = new School({
      name: 'School 1',
      promotions: [promotion],
    })
    await schoolsRepository.save(school)

    const response = await client.delete(
      `/schools/${school.id.toString()}/promotions/${promotion.id.toString()}/subjects/${subject.id.toString()}`
    )

    response.assertStatus(StatusCodes.OK)
  })
})
