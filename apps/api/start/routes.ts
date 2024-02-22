/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
const AuthController = () => import('#controllers/auth.controller')
const ExercicesController = () => import('#controllers/exercices.controller')
const QuestionsController = () => import('#controllers/questions_controller')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router
  .group(() => {
    // api routes start
    router
      .group(() => {
        // auth routes start
        router.post('/register', [AuthController, 'register'])
        router.post('/login', [AuthController, 'login'])
        // auth routes end
      })
      .prefix('auth')

    router
      .get('/protected', ({ auth }) => {
        return {
          hello: `protected ${auth.user?.email}`,
        }
      })
      .use(middleware.auth({ guards: ['api'] }))

    router.resource('questions', QuestionsController).apiOnly()
    router.resource('exercices', ExercicesController).apiOnly()
    // api routes end
  })
  .prefix('api')
