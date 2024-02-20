import { ExercicesService } from '#domainServices/exercices_service'
import { createExerciceValidator } from '#validators/create_exercice_validator'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import { ExerciceFactory } from '../../domain/factories/exercice_factory.js'
import { Id } from '#domainModels/id'
import { updateExerciceValidator } from '#validators/update_exercice_validator'

@inject()
export default class ExercicesController {
  constructor(private readonly exercicesService: ExercicesService) {}

  /**
   * Display a list of resource
   */
  async index({}: HttpContext) {
    return this.exercicesService.getExercices()
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request }: HttpContext) {
    const payload = await vine.validate({ schema: createExerciceValidator, data: request.all() })

    const exercice = ExerciceFactory.create(payload)

    return this.exercicesService.saveExercice(exercice)
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {
    if (!params.id) {
      throw new Error('Exercice id is required')
    }

    const exercice = await this.exercicesService.getExercice(new Id(params.id))
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

    const exercice = await this.exercicesService.updateExercice(new Id(params.id), payload)
    return exercice
  }

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {
    await this.exercicesService.deleteExercice(params.id)
  }
}
