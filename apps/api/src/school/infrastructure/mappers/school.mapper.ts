import { Id } from '#shared/id/domain/models/id'
import { School } from '#school/domain/models/school'
import SchoolEntity from '#school/infrastructure/entities/school'
import { Promotion } from '#school/domain/models/promotion'
import { Subject } from '#school/domain/models/subject'

export class SchoolMapper {
  static toResponse(school: School): { id: string; name: string } {
    return {
      id: school.id.toString(),
      name: school.name,
    }
  }

  static fromLucid(schoolEntity: SchoolEntity): School {
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
