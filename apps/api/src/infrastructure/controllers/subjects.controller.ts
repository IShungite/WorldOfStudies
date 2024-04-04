import { CreateSubjectService } from '#domain/services/subject/create_subject.service'
import { createSubjectValidator } from '#infrastructure/validators/school/create_subject.validator'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'

@inject()
export default class SubjectsController {
  constructor(private readonly createSubjectService: CreateSubjectService) {}

  async store({ request, response }: HttpContext) {
    const payload = await vine.validate({ schema: createSubjectValidator, data: request.all() })
    const subject = await this.createSubjectService.execute(payload)

    return response.created({
      id: subject.id.toString(),
      name: subject.name,
    })
  }
}