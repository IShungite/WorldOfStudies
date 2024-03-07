import { ICharactersRepository } from '#domainPorts/out/characters.repository'
import { IQuizzesRepository } from '#domainPorts/out/quizzes.repository'
import { ISchoolsRepository } from '#domainPorts/out/schools.repository'
import { IUsersRepository } from '#domainPorts/out/user.repository'
import { IUserAnswersRepository } from '#domainPorts/out/user_answer.repository'
import { InMemoryCharactersRepository } from '#repositories/character/in_memory_characters.repository'
import { InMemoryQuizzesRepository } from '#repositories/in_memory_quizzes.repository'
import { InMemorySchoolsRepository } from '#repositories/in_memory_schools.repository'
import { AdonisUsersRepository } from '#repositories/user/adonis_users.repository'
import { InMemoryUsersRepository } from '#repositories/user/in_memory_users.repository'
import { InMemoryUserAnswersRepository } from '#repositories/user_answer/in_memory_user_answers.repository'
import env from '#start/env'
import type { ApplicationService } from '@adonisjs/core/types'

export default class AppProvider {
  constructor(protected app: ApplicationService) {}

  private registerRepository<
    T extends abstract new (...args: any[]) => any,
    U extends new (...args: any[]) => InstanceType<T>,
  >(repositoryInterface: T, inMemoryImplementation: U, defaultImplementation: U) {
    this.app.container.singleton(repositoryInterface, async () => {
      if (env.get('DB_IN_MEMORY')) {
        return new inMemoryImplementation()
      }
      return new defaultImplementation()
    })
  }

  /**
   * Register bindings to the container
   */
  async register() {
    this.registerRepository(
      IQuizzesRepository,
      InMemoryQuizzesRepository,
      InMemoryQuizzesRepository
    )
    this.registerRepository(IUsersRepository, InMemoryUsersRepository, AdonisUsersRepository)
    this.registerRepository(
      IUserAnswersRepository,
      InMemoryUserAnswersRepository,
      InMemoryUserAnswersRepository
    )
    this.registerRepository(
      ISchoolsRepository,
      InMemorySchoolsRepository,
      InMemorySchoolsRepository
    )
    this.registerRepository(
      ICharactersRepository,
      InMemoryCharactersRepository,
      InMemoryCharactersRepository
    )
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
