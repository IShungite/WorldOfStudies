import { inject } from '@adonisjs/core'
import { Id } from '#shared/id/domain/models/id'
import { ISchoolsRepository } from '#school/domain/contracts/repositories/schools.repository'
import { School } from '#school/domain/models/school'

@inject()
export class GetSchoolsByCharacterIds {
  constructor(private readonly schoolsRepository: ISchoolsRepository) {}

  async execute(characterIds: Id[]): Promise<School[]> {
    return this.schoolsRepository.getByCharacterIds(characterIds)
  }
}
