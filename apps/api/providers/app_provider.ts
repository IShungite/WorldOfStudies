import { IExercicesRepository } from '#domainPorts/out/exercices_repository'
import { InMemoryExercicesRepository } from '#repositories/in_memory_exercices_repository'
import type { ApplicationService } from '@adonisjs/core/types'

export default class AppProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  async register() {
    this.app.container.singleton(IExercicesRepository, async () => {
      return new InMemoryExercicesRepository()
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
