import { CreateSchoolService } from '#domainServices/school/create_school.service'
import { DeleteSchoolService } from '#domainServices/school/delete_school.service'
import { GetSchoolService } from '#domainServices/school/get_school.service'
import { UpdateSchoolService } from '#domainServices/school/update_school.service'
import { DeleteSubjectService } from '#domainServices/subject/delete_subject.service'
import { SchoolMapper } from '#mappers/school.mapper'
import { createSchoolValidator } from '#validators/create_school.validator'
import { domainIdValidator } from '#validators/domain_id.validator'
import { updateSchoolValidator } from '#validators/update_school.validator'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'

@inject()
export default class SchoolsController {
  constructor(
    private readonly createSchoolService: CreateSchoolService,
    private readonly getSchoolService: GetSchoolService,
    private readonly deleteSchoolService: DeleteSchoolService,
    private readonly deleteSubjectService: DeleteSubjectService,
    private readonly updateSchoolService: UpdateSchoolService
  ) {}

  async store({ request, response }: HttpContext) {
    const payload = await vine.validate({ schema: createSchoolValidator, data: request.all() })
    const school = await this.createSchoolService.create(payload)

    return response.created(school)
  }

  async show({ params }: HttpContext) {
    const id = await vine.validate({ schema: domainIdValidator, data: params.id })
    const school = await this.getSchoolService.get(id)
    return SchoolMapper.toResponse(school)
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {
    const id = await vine.validate({ schema: domainIdValidator, data: params.id })
    const payload = await vine.validate({ schema: updateSchoolValidator, data: request.all() })

    const school = await this.updateSchoolService.update(id, payload)
    return SchoolMapper.toResponse(school)
  }

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    const id = await vine.validate({ schema: domainIdValidator, data: params.id })

    await this.deleteSchoolService.delete(id)

    return response.noContent()
  }

  /**
   * Delete subject within a school
   */

  async destroySubject({ params }: HttpContext) {
    const idSchool = await vine.validate({
      schema: domainIdValidator,
      data: params.idSchool,
    })
    const idSubject = await vine.validate({
      schema: domainIdValidator,
      data: params.idPromotion,
    })
    const idPromotion = await vine.validate({
      schema: domainIdValidator,
      data: params.idSubject,
    })

    await this.deleteSubjectService.delete(idSchool, idSubject, idPromotion)
  }
}
