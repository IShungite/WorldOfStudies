import { CreateExerciceService } from '#domainServices/exercice/create_exercice.service'
import { DeleteExerciceService } from '#domainServices/exercice/delete_exercice.service'
import { GetExerciceService } from '#domainServices/exercice/get_exercice.service'
import { GetExercicesService } from '#domainServices/exercice/get_exercices.service'
import { UpdateExerciceService } from '#domainServices/exercice/update_exercice.service'
import { createExerciceValidator } from '#validators/create_exercice.validator'
import { domainIdValidator } from '#validators/domain_id.validator'
import { updateExerciceValidator } from '#validators/update_exercice.validator'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'

@inject()
export default class ExercicesController {
  constructor(
    private readonly getExercicesService: GetExercicesService,
    private readonly getExerciceService: GetExerciceService,
    private readonly createExerciceService: CreateExerciceService,
    private readonly updateExerciceService: UpdateExerciceService,
    private readonly deleteExerciceService: DeleteExerciceService
  ) {}

  /**
   * Display a list of resource
   */
  async index({}: HttpContext) {
    return this.getExercicesService.getAll()
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request }: HttpContext) {
    const payload = await vine.validate({ schema: createExerciceValidator, data: request.all() })

    return this.createExerciceService.create(payload)
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {
    const id = await vine.validate({ schema: domainIdValidator, data: params.id })

    const exercice = await this.getExerciceService.get(id)
    return exercice
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {
    const id = await vine.validate({ schema: domainIdValidator, data: params.id })
    const payload = await vine.validate({ schema: updateExerciceValidator, data: request.all() })

    const exercice = await this.updateExerciceService.update(id, payload)
    return exercice
  }

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {
    const id = await vine.validate({ schema: domainIdValidator, data: params.id })

    await this.deleteExerciceService.delete(id)
  }
}
