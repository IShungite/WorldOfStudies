import { ClearableRepository } from '../../src/shared/clearable_repository.js'

export default async function emptyRepositories(
  repositories: ClearableRepository[]
): Promise<void> {
  await Promise.all(repositories.map((repo) => repo.empty()))
}
