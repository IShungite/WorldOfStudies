import { CreateExerciceDto } from '#domainModels/exercice'
import { ExercicesService } from '#domainServices/exercices_service'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

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
    const payload = request.all() as CreateExerciceDto

    return this.exercicesService.saveExercice(payload)
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {}

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {}
}
