import app from '@adonisjs/core/services/app'

type RepositoryTuple<T extends any[]> = {
  [K in keyof T]: T[K] extends abstract new (...args: any) => infer R ? R : never
}

export default async function createRepositories<T extends any[]>(
  repositories: T
): Promise<RepositoryTuple<T>> {
  const instances = await Promise.all(repositories.map((repo) => app.container.make(repo)))
  return instances as RepositoryTuple<T>
}
