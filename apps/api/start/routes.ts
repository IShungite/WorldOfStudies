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
const ShopsController = () => import('#controllers/shops.controller')
const SubjectsController = () => import('#controllers/subjects.controller')
const PromotionsController = () => import('#controllers/promotions.controller')
const CharactersController = () => import('#controllers/characters.controller')
const SchoolsController = () => import('#controllers/schools.controller')
const UserAnswersController = () => import('#controllers/user_answers.controller')
const AuthController = () => import('#controllers/auth.controller')
const QuizzesController = () => import('#controllers/quizzes.controller')
const onlyNumbersRegex: RegExp = /^\d+$/

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
        router.post('register', [AuthController, 'register'])
        router.post('login', [AuthController, 'login'])
        // auth routes end
      })
      .prefix('auth')

    router
      .get('protected', ({ auth }) => {
        return {
          hello: `protected ${auth.user?.email}`,
        }
      })
      .use(middleware.auth({ guards: ['api'] }))

    router.resource('quizzes', QuizzesController).apiOnly()

    router.resource('user-answers', UserAnswersController).only(['store'])

    router
      .delete('schools/:idSchool/promotions/:idPromotion/subjects/:idSubject', [
        SchoolsController,
        'destroySubject',
      ])
      .where('idSchool', onlyNumbersRegex)
      .where('idPromotion', onlyNumbersRegex)
      .where('idSubject', onlyNumbersRegex)

    router
      .patch('schools/:idSchool/promotions/:idPromotion/subjects/:idSubject', [
        SchoolsController,
        'updateSubject',
      ])
      .where('idSchool', onlyNumbersRegex)
      .where('idPromotion', onlyNumbersRegex)
      .where('idSubject', onlyNumbersRegex)

    router
      .delete('schools/:idSchool/promotions/:idPromotion', [SchoolsController, 'destroyPromotion'])
      .where('idSchool', onlyNumbersRegex)
      .where('idPromotion', onlyNumbersRegex)

    router
      .patch('schools/:idSchool/promotions/:idPromotion', [SchoolsController, 'updatePromotion'])
      .where('idSchool', onlyNumbersRegex)
      .where('idPromotion', onlyNumbersRegex)

    router.resource('schools', SchoolsController).apiOnly()
    router.get('schools/:id/shop', [SchoolsController, 'getShop'])

    router
      .resource('characters', CharactersController)
      .only(['store', 'update', 'destroy'])
      .where('id', onlyNumbersRegex)
    router.get('user/:id/characters', [CharactersController, 'charactersByUserId'])

    router.resource('promotions', PromotionsController).only(['store'])

    router.resource('subjects', SubjectsController).only(['store'])

    router.resource('shops', ShopsController).only(['store'])

    // api routes end
  })
  .prefix('api')
