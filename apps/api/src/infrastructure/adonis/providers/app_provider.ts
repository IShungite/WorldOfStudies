import { ICharactersRepository } from '../../../character/domain/contracts/repositories/characters.repository.js'
import { IQuizzesRepository } from '../../../quiz/domain/contracts/quizzes.repository.js'
import { ISchoolsRepository } from '../../../school/domain/contracts/repositories/schools.repository.js'
import { IUsersRepository } from '../../../user/domain/contracts/repositories/users.repository.js'
import { IUserAnswersRepository } from '../../../quiz/domain/contracts/user_answers.repository.js'
import { InMemoryCharactersRepository } from '../../../character/infrastructure/repositories/in_memory_characters.repository.js'
import { InMemoryQuizzesRepository } from '../../../quiz/infrastructure/repositories/quiz/in_memory_quizzes.repository'
import { InMemorySchoolsRepository } from '../../../school/infrastructure/repositories/in_memory_schools.repository.js'
import { LucidUsersRepository } from '../../../user/infrastructure/repositories/lucid_users.repository.js'
import { InMemoryUsersRepository } from '../../../user/infrastructure/repositories/in_memory_users.repository.js'
import { InMemoryUserAnswersRepository } from '../../../quiz/infrastructure/repositories/user_answer/in_memory_user_answers.repository'
import env from '#infrastructure/adonis/env'
import type { ApplicationService } from '@adonisjs/core/types'
import { IShopsRepository } from '../../../shop/domain/contracts/repositories/shops.repository.js'
import { InMemoryShopsRepository } from '../../../shop/infrastructure/repositories/in_memory_shops.repository.js'
import { LucidCharactersRepository } from '../../../character/infrastructure/repositories/lucid_characters.repository.js'
import { LucidSchoolsRepository } from '../../../school/infrastructure/repositories/lucid_schools.repository.js'
import { LucidShopsRepository } from '../../../shop/infrastructure/repositories/lucid_shops.repository.js'
import { LucidQuizzesRepository } from '../../../quiz/infrastructure/repositories/quiz/lucid_quizzes.repository'
import { LucidUserAnswersRepository } from '../../../quiz/infrastructure/repositories/user_answer/lucid_user_answers.repository'

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
