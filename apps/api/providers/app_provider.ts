import { InMemoryQuizRepository } from '#adapter/in_memory_quizzes_repository'
import { IQuizzesRepository } from '#port/out/quizzes_repository'
import type { ApplicationService } from '@adonisjs/core/types'

export default class AppProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  async register() {
    this.app.container.singleton(IQuizzesRepository, async () => {
      return new InMemoryQuizRepository()
    })
  }

  /**
   * The container bindings have booted
   */
  async boot() {}

  /**
   * The application has been booted
   */
  async start() {}

  /**
   * The process has been started
   */
  async ready() {}

  /**
   * Preparing to shutdown the app
   */
  async shutdown() {}
}
