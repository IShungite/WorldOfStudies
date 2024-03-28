import { Id } from '#domain/models/id/id'
import { Promotion } from '#domain/models/school/promotion'
import { PromotionNotFoundException } from '#domain/models/school/promotion_not_found.exception'
import { School } from '#domain/models/school/school'
import { SchoolNotFoundException } from '#domain/models/school/school_not_found.exception'
import { Subject } from '#domain/models/school/subject'
import { SubjectNotFoundException } from '#domain/models/school/subject_not_found.exception'
import { ISchoolsRepository } from '#domain/ports/out/schools.repository'
import app from '@adonisjs/core/services/app'
import { test } from '@japa/runner'
import { StatusCodes } from 'http-status-codes'

test.group('Subjects - update', (group) => {
  let schoolsRepository: ISchoolsRepository

  group.setup(async () => {
    ;[schoolsRepository] = await Promise.all([app.container.make(ISchoolsRepository)])
  })

  group.each.setup(async () => {
    await Promise.all([schoolsRepository.empty()])
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

  test('It should update a subject', async ({ client }) => {
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
        name: 'Subject 99',
      })

    response.assertStatus(StatusCodes.OK)
    response.assertBodyContains({ name: 'Subject 99' })
  })
})
