import { Id } from '#domainModels/id'
import { CreateExercicesService } from '#domainServices/exercice/create_exercices.service'
import { DeleteExerciceService } from '#domainServices/exercice/delete_exercice.service'
import { GetExerciceService } from '#domainServices/exercice/get_exercice.service'
import { GetExercicesService } from '#domainServices/exercice/get_exercices.service'
import { UpdateExerciceService } from '#domainServices/exercice/update_exercice.service'
import { createExerciceValidator } from '#validators/create_exercice.validator'
import { updateExerciceValidator } from '#validators/update_exercice.validator'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'

@inject()
export default class ExercicesController {
  constructor(
    private readonly getExercicesService: GetExercicesService,
    private readonly getExerciceService: GetExerciceService,
    private readonly createExerciceService: CreateExercicesService,
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
  async store({ request, response }: HttpContext) {
    const payload = await vine.validate({ schema: createExerciceValidator, data: request.all() })

    response.status(201)
    return this.createExerciceService.create(payload)
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {
    if (!params.id) {
      throw new Error('Exercice id is required')
    }

    const exercice = await this.getExerciceService.get(new Id(params.id))
    return exercice
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {
    if (!params.id) {
      throw new Error('Exercice id is required')
    }

    const payload = await vine.validate({ schema: updateExerciceValidator, data: request.all() })

    const exercice = await this.updateExerciceService.update(new Id(params.id), payload)
    return exercice
  }

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {
    await this.deleteExerciceService.delete(new Id(params.id))
  }
}
