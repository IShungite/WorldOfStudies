import { ISubjectsRepository } from '#school/domain/contracts/repositories/subjects.repository'
import { SubjectNotFoundException } from '#school/domain/models/subject_not_found.exception'
import { Id } from '#shared/id/domain/models/id'
import createRepositories from '#tests/utils/create_repositories'
import emptyRepositories from '#tests/utils/empty_repositories'
import { test } from '@japa/runner'
import { StatusCodes } from 'http-status-codes'

test.group('Subjects - destroy', (group) => {
  let subjectRepository: ISubjectsRepository

  group.setup(async () => {
    ;[subjectRepository] = await createRepositories([ISubjectsRepository])
  })

  group.each.setup(async () => {
    await emptyRepositories([subjectRepository])
  })

  test('It should return an exception if the subject does not exist', async ({ client }) => {
    const id = new Id('1')

    const response = await client.delete(`subjects/${id.toString()}`)

    response.assertStatus(StatusCodes.BAD_REQUEST)
    response.assertTextIncludes(new SubjectNotFoundException(id).message)
  })
})
