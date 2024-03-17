import { defineConfig } from '@adonisjs/auth'
import { tokensGuard, tokensUserProvider } from '@adonisjs/auth/access_tokens'
import { Authenticators, InferAuthEvents } from '@adonisjs/auth/types'
import env from '#start/env'

const authConfig = defineConfig({
  default: 'api',
  guards: {
    api: tokensGuard({
      provider: tokensUserProvider({
        tokens: 'accessTokens',
        model: (): Promise<typeof import('#models/user')> => {
          if (env.get('DB_CONNECTION') === 'in_memory') {
            return import('../app/adapters/utils/user_entity_for_auth_when_in_memory.js') as any
          }

          return import('#models/user')
        },
      }),
    }),
  },
})

export default authConfig

/**
 * Inferring types from the configured auth
 * guards.
 */
declare module '@adonisjs/auth/types' {
  interface Authenticators extends InferAuthenticators<typeof authConfig> {}
}
declare module '@adonisjs/core/types' {
  interface EventsList extends InferAuthEvents<Authenticators> {}
}
