import { CreateSchoolService } from '#domainServices/school/create_school.service'
import { DeleteSchoolService } from '#domainServices/school/delete_school.service'
import { GetSchoolService } from '#domainServices/school/get_school.service'
import { SchoolMapper } from '#mappers/school.mapper'
import { createSchoolValidator } from '#validators/create_school.validator'
import { domainIdValidator } from '#validators/domain_id.validator'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'

@inject()
export default class SchoolsController {
  constructor(
    private readonly createSchoolService: CreateSchoolService,
    private readonly getSchoolService: GetSchoolService,
    private readonly deleteSchoolService: DeleteSchoolService
  ) {}

  async store({ request, response }: HttpContext) {
    const payload = await vine.validate({ schema: createSchoolValidator, data: request.all() })
    const school = await this.createSchoolService.create(payload)

    return response.created(school)
  }

  async show({ params }: HttpContext) {
    const id = await vine.validate({ schema: domainIdValidator, data: params.id })
    const school = await this.getSchoolService.get(id)
    return school ? SchoolMapper.toResponse(school) : null
  }

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {
    const id = await vine.validate({ schema: domainIdValidator, data: params.id })

    await this.deleteSchoolService.delete(id)
  }
}
