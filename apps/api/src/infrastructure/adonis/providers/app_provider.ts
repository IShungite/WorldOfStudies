import type { ApplicationService } from '@adonisjs/core/types'
import { IQuizzesRepository } from '#quiz/domain/contracts/quizzes.repository'
import { IUsersRepository } from '#user/domain/contracts/repositories/users.repository'
import { IUserAnswersRepository } from '#quiz/domain/contracts/user_answers.repository'
import { LucidUserAnswersRepository } from '#quiz/infrastructure/repositories/user_answer/lucid_user_answers.repository'
import { ISchoolsRepository } from '#school/domain/contracts/repositories/schools.repository'
import { ICharactersRepository } from '#character/domain/contracts/repositories/characters.repository'
import { LucidCharactersRepository } from '#character/infrastructure/repositories/lucid_characters.repository'
import { IShopsRepository } from '#shop/domain/contracts/repositories/shops.repository'
import { LucidQuizzesRepository } from '#quiz/infrastructure/repositories/quiz/lucid_quizzes.repository'
import { LucidUsersRepository } from '#user/infrastructure/repositories/lucid_users.repository'
import { LucidSchoolsRepository } from '#school/infrastructure/repositories/lucid_schools.repository'
import { LucidShopsRepository } from '#shop/infrastructure/repositories/lucid_shops.repository'
import { IQuizzesInstanceRepository } from '#quiz/domain/contracts/quizzes_instance.repository'
import { LucidQuizzesInstanceRepository } from '#quiz/infrastructure/repositories/quiz/lucid_quizzes_instance.repository'
import { IItemRepository } from '#item/domain/contracts/items_repository.contract'
import { LucidItemsRepository } from '#item/infrastructure/repositories/lucid_items.repository'
import { IInventoriesRepository } from '#inventory/domain/contracts/repositories/inventories.repository'
import { LucidInventoriesRepository } from '#inventory/infrastructure/repositories/lucid_inventories.repository'
import { ISubjectsRepository } from '#school/domain/contracts/repositories/subjects.repository'
import { LucidSubjectsRepository } from '#school/infrastructure/repositories/lucid_subjects.repository'

export default class AppProvider {
  constructor(protected app: ApplicationService) {}

  private registerRepository<
    T extends abstract new (...args: any[]) => any,
    V extends new (...args: any[]) => InstanceType<T>,
  >(repositoryInterface: T, defaultImplementation: V) {
    this.app.container.singleton(repositoryInterface, async () => {
      return new defaultImplementation()
    })
  }

  /**
   * Register bindings to the container
   */
  async register() {
    this.registerRepository(IQuizzesRepository, LucidQuizzesRepository)
    this.registerRepository(IUsersRepository, LucidUsersRepository)
    this.registerRepository(IUserAnswersRepository, LucidUserAnswersRepository)
    this.registerRepository(ISchoolsRepository, LucidSchoolsRepository)
    this.registerRepository(ICharactersRepository, LucidCharactersRepository)
    this.registerRepository(IShopsRepository, LucidShopsRepository)
    this.registerRepository(IQuizzesInstanceRepository, LucidQuizzesInstanceRepository)
    this.registerRepository(IItemRepository, LucidItemsRepository)
    this.registerRepository(IInventoriesRepository, LucidInventoriesRepository)
    this.registerRepository(ISubjectsRepository, LucidSubjectsRepository)
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
