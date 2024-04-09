import { Id } from '../../../shared/id/domain/models/id.js'
import { School } from '../../domain/models/school.js'
import SchoolEntity from '../entities/school.js'
import { Promotion } from '../../domain/models/promotion.js'
import { Subject } from '../../domain/models/subject.js'

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
