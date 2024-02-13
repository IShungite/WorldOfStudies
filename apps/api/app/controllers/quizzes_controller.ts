import { CreateQuizDto } from '#domain/quiz'
import { QuizzesService } from '#services/quizzes_service'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  /**
   * Display a list of resource
   */
  async index({}: HttpContext) {
    return this.quizzesService.getQuizzes()
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request }: HttpContext) {
    const payload = request.all() as CreateQuizDto

    return this.quizzesService.saveQuiz(payload)
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
