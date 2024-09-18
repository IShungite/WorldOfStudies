import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import { CreateSubjectService } from '#school/domain/services/subject/create_subject.service'
import { createSubjectValidator } from '#school/infrastructure/validators/school/create_subject.validator'
import { domainIdValidator } from '#shared/id/infrastructure/validators/domain_id.validator'
import { updateSubjectValidator } from '#school/infrastructure/validators/update_subject.validator'
import { UpdateSubjectService } from '#school/domain/services/subject/update_subject.service'
import { DeleteSubjectService } from '#school/domain/services/subject/delete_subject.service'
import { SubjectApiMapper } from '#school/infrastructure/mappers/subject_api.mapper'

@inject()
export default class SubjectsController {
  constructor(
    private readonly createSubjectService: CreateSubjectService,
    private readonly deleteSubjectService: DeleteSubjectService,
    private readonly updateSubjectService: UpdateSubjectService
  ) {}

  async store({ request, response }: HttpContext) {
    const payload = await vine.validate({ schema: createSubjectValidator, data: request.all() })
    const subject = await this.createSubjectService.execute(payload)

    return response.created({
      id: subject.id.toString(),
      name: subject.name,
    })
  }

  async update({ params, request, response }: HttpContext) {
    const idSubject = await vine.validate({
      schema: domainIdValidator,
      data: params.id,
    })

    const payload = await vine.validate({ schema: updateSubjectValidator, data: request.all() })

    const subject = await this.updateSubjectService.execute(idSubject, payload)

    return response.ok(SubjectApiMapper.toResponse(subject))
  }

  async destroy({ params }: HttpContext) {
    const idSubject = await vine.validate({
      schema: domainIdValidator,
      data: params.id,
    })

    await this.deleteSubjectService.execute(idSubject)
  }
}
