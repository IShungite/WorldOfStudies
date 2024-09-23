import { ISubjectsRepository } from '#school/domain/contracts/repositories/subjects.repository'
import { Subject } from '#school/domain/models/subject'
import { SubjectNotFoundException } from '#school/domain/models/subject_not_found.exception'
import { Id } from '#shared/id/domain/models/id'
import createRepositories from '#tests/utils/create_repositories'
import emptyRepositories from '#tests/utils/empty_repositories'
import { test } from '@japa/runner'
import { StatusCodes } from 'http-status-codes'

test.group('Subjects - update', (group) => {
  let subjectsRepository: ISubjectsRepository
  group.setup(async () => {
    ;[subjectsRepository] = await createRepositories([ISubjectsRepository])
  })

  group.each.setup(async () => {
    await emptyRepositories([subjectsRepository])
  })

  test('It should return an exception if the subject does not exist', async ({ client }) => {
    const id = new Id('1')
    const response = await client.patch(`/subjects/${id.toString()}`)

    response.assertStatus(StatusCodes.BAD_REQUEST)
    response.assertTextIncludes(new SubjectNotFoundException(id).message)
  })

  test('It should return a 422 when the payload is invalid', async ({ client }) => {
    const subject = await subjectsRepository.save(new Subject({ name: 'Subject 1' }))

    const response = await client.patch(`/subjects/${subject.id.toString()}`).json({
      name: {},
    })

    response.assertStatus(StatusCodes.UNPROCESSABLE_ENTITY)
  })
})
