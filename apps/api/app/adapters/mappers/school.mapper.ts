import { School } from '#domainModels/school'

export class SchoolMapper {
  static toResponse(school: School): { id: string; name: string } {
    return {
      id: school.id.toString(),
      name: school.name,
    }
  }
}
