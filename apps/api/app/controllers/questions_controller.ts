import QuestionsServices from '#services/questions_services'
import { storeQuestionValidator } from '#validators/store_question'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class QuestionsController {
  constructor(private readonly questionsService: QuestionsServices) {}

  /**
   * Display a list of resource
   */
  async index({}: HttpContext) {
    return this.questionsService.getQuestions()
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request }: HttpContext) {
    const payload = await storeQuestionValidator.validate(request.all())

    return this.questionsService.createQuestion(payload)
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
