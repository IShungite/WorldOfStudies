import { Id } from '#domainModels/id/id'
import { School } from '#domainModels/school/school'
import SchoolEntity from '#models/school'
import { Promotion } from '#domainModels/school/promotion'
import { Subject } from '#domainModels/school/subject'

export class SchoolMapper {
  static toResponse(school: School): { id: string; name: string } {
    return {
      id: school.id.toString(),
      name: school.name,
    }
  }

  static async fromAdonis(schoolEntity: SchoolEntity): Promise<School> {
    return new School({
      id: new Id(schoolEntity.id.toString()),
      name: schoolEntity.name,
      promotions: schoolEntity.promotions.map(
        (promotionEntity) =>
          new Promotion({
            id: new Id(promotionEntity.id.toString()),
            name: promotionEntity.name,
            year: promotionEntity.year,
            subjects: promotionEntity.subjects.map(
              (s) =>
                new Subject({
                  id: new Id(s.id.toString()),
                  name: s.name,
                })
            ),
          })
      ),
    })
  }
}
