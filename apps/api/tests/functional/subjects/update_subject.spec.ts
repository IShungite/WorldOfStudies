import { test } from '@japa/runner'
import { StatusCodes } from 'http-status-codes'
import createRepositories from '#tests/utils/create_repositories'
import emptyRepositories from '#tests/utils/empty_repositories'
import { ISchoolsRepository } from '#school/domain/contracts/repositories/schools.repository'
import { Id } from '#shared/id/domain/models/id'
import { SchoolNotFoundException } from '#school/domain/models/school_not_found.exception'
import { PromotionNotFoundException } from '#school/domain/models/promotion_not_found.exception'
import { SubjectNotFoundException } from '#school/domain/models/subject_not_found.exception'
import { School } from '#school/domain/models/school'
import { Promotion } from '#school/domain/models/promotion'
import { Subject } from '#school/domain/models/subject'

test.group('Subjects - update', (group) => {
  let schoolsRepository: ISchoolsRepository

  group.setup(async () => {
    ;[schoolsRepository] = await createRepositories([ISchoolsRepository])
  })

  group.each.setup(async () => {
    await emptyRepositories([schoolsRepository])
  })

  test('It should return a 404 if one or more params are not a number', async ({ client }) => {
    const response = await client.patch('/schools/1/promotions/1/subjects/bob')

    response.assertStatus(StatusCodes.NOT_FOUND)
  })

  test('It should return an exception if the school does not exist', async ({ client }) => {
    const id = new Id('1')
    const response = await client.patch(`/schools/${id.toString()}/promotions/1/subjects/1`)

    response.assertStatus(StatusCodes.BAD_REQUEST)
    response.assertTextIncludes(new SchoolNotFoundException(id).message)
  })

  test('It should return an exception if the promotion does not exist', async ({ client }) => {
    const school = new School({ name: 'School 1', promotions: [] })
    const id = new Id('1')

    await schoolsRepository.save(school)

    const response = await client.patch(
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

    const response = await client.patch(
      `/schools/${school.id.toString()}/promotions/${promotion.id.toString()}/subjects/${id.toString()}`
    )

    response.assertStatus(StatusCodes.BAD_REQUEST)
    response.assertTextIncludes(new SubjectNotFoundException(id).message)
  })

  test('It should return a 422 when the payload is invalid', async ({ client }) => {
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

    const response = await client
      .patch(
        `/schools/${school.id.toString()}/promotions/${promotion.id.toString()}/subjects/${subject.id.toString()}`
      )
      .json({
        name: {},
      })

    response.assertStatus(StatusCodes.UNPROCESSABLE_ENTITY)
  })
})
