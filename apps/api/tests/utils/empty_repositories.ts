import { ClearableRepository } from '#shared/storage/clearable_repository'

export default async function emptyRepositories(
  repositories: ClearableRepository[]
): Promise<void> {
  await Promise.all(repositories.map((repo) => repo.empty()))
}
