import { ICharactersRepository } from '#domain/contracts/repositories/characters.repository'
import { IQuizzesRepository } from '#domain/contracts/repositories/quizzes.repository'
import { ISchoolsRepository } from '#domain/contracts/repositories/schools.repository'
import { IUsersRepository } from '#domain/contracts/repositories/users.repository'
import { IUserAnswersRepository } from '#domain/contracts/repositories/user_answers.repository'
import { InMemoryCharactersRepository } from '#infrastructure/repositories/character/in_memory_characters.repository'
import { InMemoryQuizzesRepository } from '#infrastructure/repositories/quiz/in_memory_quizzes.repository'
import { InMemorySchoolsRepository } from '#infrastructure/repositories/school/in_memory_schools.repository'
import { LucidUsersRepository } from '#infrastructure/repositories/user/lucid_users.repository'
import { InMemoryUsersRepository } from '#infrastructure/repositories/user/in_memory_users.repository'
import { InMemoryUserAnswersRepository } from '#infrastructure/repositories/user_answer/in_memory_user_answers.repository'
import env from '#infrastructure/adonis/env'
import type { ApplicationService } from '@adonisjs/core/types'
import { IShopsRepository } from '#domain/contracts/repositories/shops.repository'
import { InMemoryShopsRepository } from '#infrastructure/repositories/shop/in_memory_shops.repository'
import { LucidCharactersRepository } from '#infrastructure/repositories/character/lucid_characters.repository'
import { LucidSchoolsRepository } from '#infrastructure/repositories/school/lucid_schools.repository'
import { LucidShopsRepository } from '#infrastructure/repositories/shop/lucid_shops.repository'
import { LucidQuizzesRepository } from '#infrastructure/repositories/quiz/lucid_quizzes.repository'
import { LucidUserAnswersRepository } from '#infrastructure/repositories/user_answer/lucid_user_answers.repository'

export default class AppProvider {
  constructor(protected app: ApplicationService) {}

  private registerRepository<
    T extends abstract new (...args: any[]) => any,
    U extends new (...args: any[]) => InstanceType<T>,
    V extends new (...args: any[]) => InstanceType<T>,
  >(repositoryInterface: T, inMemoryImplementation: U, defaultImplementation: V) {
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
    this.registerRepository(IQuizzesRepository, InMemoryQuizzesRepository, LucidQuizzesRepository)
    this.registerRepository(IUsersRepository, InMemoryUsersRepository, LucidUsersRepository)
    this.registerRepository(
      IUserAnswersRepository,
      InMemoryUserAnswersRepository,
      LucidUserAnswersRepository
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
