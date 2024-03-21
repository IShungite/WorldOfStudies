import { ICharactersRepository } from '#domainPorts/out/characters.repository'
import { IQuizzesRepository } from '#domainPorts/out/quizzes.repository'
import { ISchoolsRepository } from '#domainPorts/out/schools.repository'
import { IUsersRepository } from '#domainPorts/out/users.repository'
import { IUserAnswersRepository } from '#domainPorts/out/user_answers.repository'
import { InMemoryCharactersRepository } from '#repositories/character/in_memory_characters.repository'
import { InMemoryQuizzesRepository } from '#repositories/in_memory_quizzes.repository'
import { InMemorySchoolsRepository } from '#repositories/school/in_memory_schools.repository'
import { LucidUsersRepository } from '#repositories/user/lucid_users.repository'
import { InMemoryUsersRepository } from '#repositories/user/in_memory_users.repository'
import { InMemoryUserAnswersRepository } from '#repositories/user_answer/in_memory_user_answers.repository'
import env from '#start/env'
import type { ApplicationService } from '@adonisjs/core/types'
import { IShopsRepository } from '#domainPorts/out/shops.repository'
import { InMemoryShopsRepository } from '#repositories/shop/in_memory_shops.repository'
import { LucidCharactersRepository } from '#repositories/character/lucid_characters.repository'
import { LucidSchoolsRepository } from '#repositories/school/lucid_schools.repository'
import { LucidShopsRepository } from '#repositories/shop/lucid_shops.repository'

export default class AppProvider {
  constructor(protected app: ApplicationService) {}

  private registerRepository<
    T extends abstract new (...args: any[]) => any,
    U extends new (...args: any[]) => InstanceType<T>,
  >(repositoryInterface: T, inMemoryImplementation: U, defaultImplementation: U) {
    this.app.container.singleton(repositoryInterface, async () => {
      if (env.get('DB_CONNECTION') === 'in_memory') {
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
    this.registerRepository(IUsersRepository, InMemoryUsersRepository, LucidUsersRepository)
    this.registerRepository(
      IUserAnswersRepository,
      InMemoryUserAnswersRepository,
      InMemoryUserAnswersRepository
    )
    this.registerRepository(ISchoolsRepository, InMemorySchoolsRepository, LucidSchoolsRepository)
    this.registerRepository(
      ICharactersRepository,
      InMemoryCharactersRepository,
      LucidCharactersRepository
    )
    this.registerRepository(IShopsRepository, InMemoryShopsRepository, LucidShopsRepository)
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
