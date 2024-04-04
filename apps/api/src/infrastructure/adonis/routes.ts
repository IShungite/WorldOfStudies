/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#infrastructure/adonis/kernel'
const StoreShopProductController = () =>
  import('#infrastructure/controllers/shop/product/store_shop_product.controller')
const UpdateShopCategoryController = () =>
  import('#infrastructure/controllers/shop/category/update_shop_category.controller')
const DestroyShopCategoryController = () =>
  import('#infrastructure/controllers/shop/category/destroy_shop_category.controller')

const ShopsController = () => import('#infrastructure/controllers/shops.controller')
const SubjectsController = () => import('#infrastructure/controllers/subjects.controller')
const PromotionsController = () => import('#infrastructure/controllers/promotions.controller')
const CharactersController = () => import('#infrastructure/controllers/characters.controller')
const SchoolsController = () => import('#infrastructure/controllers/schools.controller')
const UserAnswersController = () => import('#infrastructure/controllers/user_answers.controller')
const AuthController = () => import('#infrastructure/controllers/auth.controller')
const QuizzesController = () => import('#infrastructure/controllers/quizzes.controller')
const StoreShopCategoryController = () =>
  import('#infrastructure/controllers/shop/category/store_shop_category.controller')
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
    router.get('schools/:id/shop', [SchoolsController, 'getShop']).where('id', onlyNumbersRegex)
    router
      .delete('schools/:id/shop', [SchoolsController, 'destroyShop'])
      .where('id', onlyNumbersRegex)
    router
      .post('schools/:schoolId/shop/categories', [StoreShopCategoryController])
      .where('schoolId', onlyNumbersRegex)
    router
      .delete('schools/:schoolId/shop/categories/:categoryId', [DestroyShopCategoryController])
      .where('schoolId', onlyNumbersRegex)
      .where('categoryId', onlyNumbersRegex)
    router
      .patch('schools/:schoolId/shop/categories/:categoryId', [UpdateShopCategoryController])
      .where('schoolId', onlyNumbersRegex)
      .where('categoryId', onlyNumbersRegex)
    router
      .post('schools/:schoolId/shop/categories/:categoryId/products', [StoreShopProductController])
      .where('schoolId', onlyNumbersRegex)
      .where('categoryId', onlyNumbersRegex)

    router
      .resource('characters', CharactersController)
      .only(['store', 'update', 'destroy'])
      .where('id', onlyNumbersRegex)
    router.get('users/:id/characters', [CharactersController, 'charactersByUserId'])

    router.resource('promotions', PromotionsController).only(['store'])

    router.resource('subjects', SubjectsController).only(['store'])

    router.resource('shops', ShopsController).only(['store'])

    // api routes end
  })
  .prefix('api')
