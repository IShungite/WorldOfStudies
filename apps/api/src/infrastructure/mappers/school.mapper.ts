import { Id } from '#domain/models/id/id'
import { School } from '#domain/models/school/school'
import SchoolEntity from '#infrastructure/entities/school'
import { Promotion } from '#domain/models/school/promotion'
import { Subject } from '#domain/models/school/subject'

export class SchoolMapper {
  static toResponse(school: School): { id: string; name: string } {
    return {
      id: school.id.toString(),
      name: school.name,
    }
  }

  static async fromLucid(schoolEntity: SchoolEntity): Promise<School> {
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
