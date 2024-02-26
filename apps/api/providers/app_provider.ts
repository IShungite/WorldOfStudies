import { IQuizzesRepository } from '#domainPorts/out/quizzes.repository'
import { IUsersRepository } from '#domainPorts/out/user.repository'
import { IUserAnswersRepository } from '#domainPorts/out/user_answer.repository'
import { InMemoryQuizzesRepository } from '#repositories/in_memory_quizzes.repository'
import { InMemoryUsersRepository } from '#repositories/user/in_memory_users.repository'
import { InMemoryUserAnswersRepository } from '#repositories/user_answer/in_memory_user_answers.repository'
import type { ApplicationService } from '@adonisjs/core/types'

export default class AppProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  async register() {
    this.app.container.singleton(IQuizzesRepository, async () => {
      return new InMemoryQuizzesRepository()
    })

    this.app.container.singleton(IUsersRepository, async () => {
      return new InMemoryUsersRepository()
    })

    this.app.container.singleton(IUserAnswersRepository, async () => {
      return new InMemoryUserAnswersRepository()
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
