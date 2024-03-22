import { Id } from '#domainModels/id/id'
import { Promotion } from '#domainModels/school/promotion'
import { PromotionNotFoundException } from '#domainModels/school/promotion_not_found.exception'
import { School } from '#domainModels/school/school'
import { SchoolNotFoundException } from '#domainModels/school/school_not_found.exception'
import { ISchoolsRepository } from '#domainPorts/out/schools.repository'
import { getUrl } from '#utils/get_url'
import app from '@adonisjs/core/services/app'
import { test } from '@japa/runner'
import { StatusCodes } from 'http-status-codes'

test.group('Promotions - update', (group) => {
  let schoolsRepository: ISchoolsRepository

  group.setup(async () => {
    ;[schoolsRepository] = await Promise.all([app.container.make(ISchoolsRepository)])
  })

  group.each.setup(async () => {
    await Promise.all([schoolsRepository.empty()])
  })

  test('It should return a 404 if one or more params are not a number', async ({ client }) => {
    const response = await client.patch('/schools/1/promotions/bob')

    response.assertStatus(StatusCodes.NOT_FOUND)
  })

  test('It should return an exception if the school does not exist', async ({ client }) => {
    const id = new Id('1')
    const response = await client.patch(`/schools/${id.toString()}/promotions/1`)

    response.assertStatus(StatusCodes.BAD_REQUEST)
    response.assertTextIncludes(new SchoolNotFoundException(id).message)
  })

  test('It should return an exception if the promotion does not exist', async ({ client }) => {
    const school = new School({ name: 'School 1', promotions: [] })
    const id = new Id('1')

    await schoolsRepository.save(school)

    const response = await client.patch(
      `/schools/${school.id.toString()}/promotions/${id.toString()}`
    )

    response.assertStatus(StatusCodes.BAD_REQUEST)
    response.assertTextIncludes(new PromotionNotFoundException(id).message)
  })

  test('It should return a 422 when the payload is invalid', async ({ client }) => {
    const promotion = new Promotion({
      name: 'Promotion 1',
      year: 2022,
      subjects: [],
    })
    const school = new School({
      name: 'School 1',
      promotions: [promotion],
    })
    await schoolsRepository.save(school)

    const response = await client
      .patch(`/schools/${school.id.toString()}/promotions/${promotion.id.toString()}`)
      .json({
        name: {},
      })

    response.assertStatus(StatusCodes.UNPROCESSABLE_ENTITY)
  })

  test('It should update a promotion', async ({ client, assert }) => {
    const promotion = new Promotion({
      name: 'Promotion 1',
      year: 2022,
      subjects: [],
    })
    const school = new School({
      name: 'School 1',
      promotions: [promotion],
    })
    await schoolsRepository.save(school)

    const response = await client
      .patch(`/schools/${school.id.toString()}/promotions/${promotion.id.toString()}`)
      .json({
        name: 'Promotion 99',
      })

    const updatedSchool = await schoolsRepository.getById(school.id)
    const updatedPromotion = updatedSchool?.promotions.find((p) => p.id.equals(promotion.id))

    response.assertStatus(StatusCodes.NO_CONTENT)
    response.assertHeader(
      'location',
      getUrl(`schools/${school.id.toString()}/promotions/${promotion.id.toString()}`)
    )
    assert.isTrue(updatedPromotion?.name === 'Promotion 99')
  })
})