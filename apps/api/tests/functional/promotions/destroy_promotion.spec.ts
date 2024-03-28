import { Id } from '#domain/models/id/id'
import { Promotion } from '#domain/models/school/promotion'
import { PromotionNotFoundException } from '#domain/models/school/promotion_not_found.exception'
import { School } from '#domain/models/school/school'
import { SchoolNotFoundException } from '#domain/models/school/school_not_found.exception'
import { ISchoolsRepository } from '#domain/contracts/repositories/schools.repository'
import app from '@adonisjs/core/services/app'
import { test } from '@japa/runner'
import { StatusCodes } from 'http-status-codes'

test.group('Promotions - destroy', (group) => {
  let schoolsRepository: ISchoolsRepository

  group.setup(async () => {
    ;[schoolsRepository] = await Promise.all([app.container.make(ISchoolsRepository)])
  })

  group.each.setup(async () => {
    await Promise.all([schoolsRepository.empty()])
  })

  test('It should return a 404 if one or more params are not a number', async ({ client }) => {
    const response = await client.delete('/schools/1/promotions/bob')

    response.assertStatus(StatusCodes.NOT_FOUND)
  })

  test('It should return an exception if the school does not exist', async ({ client }) => {
    const id = new Id('1')
    const response = await client.delete(`/schools/${id.toString()}/promotions/1`)

    response.assertStatus(StatusCodes.BAD_REQUEST)
    response.assertTextIncludes(new SchoolNotFoundException(id).message)
  })

  test('It should return an exception if the promotion does not exist', async ({ client }) => {
    const school = new School({ name: 'School 1', promotions: [] })
    const id = new Id('1')

    await schoolsRepository.save(school)

    const response = await client.delete(
      `/schools/${school.id.toString()}/promotions/${id.toString()}`
    )

    response.assertStatus(StatusCodes.BAD_REQUEST)
    response.assertTextIncludes(new PromotionNotFoundException(id).message)
  })

  test('It should destroy a promotion', async ({ client, assert }) => {
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

    const response = await client.delete(
      `/schools/${school.id.toString()}/promotions/${promotion.id.toString()}`
    )

    const updatedSchool = await schoolsRepository.getById(school.id)

    response.assertStatus(StatusCodes.NO_CONTENT)
    assert.isUndefined(updatedSchool?.promotions.find((p) => p.id.equals(promotion.id)))
  })
})
