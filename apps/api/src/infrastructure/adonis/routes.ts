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

const AuthController = () => import('#user/infrastructure/controllers/auth.controller')
const QuizzesController = () => import('#quiz/infrastructure/controllers/quizzes.controller')
const UserAnswersController = () =>
  import('#quiz/infrastructure/controllers/user_answers.controller')
const SchoolsController = () => import('#school/infrastructure/controllers/schools.controller')
const StoreShopCategoryController = () =>
  import('#shop/infrastructure/controllers/category/store_shop_category.controller')
const DestroyShopCategoryController = () =>
  import('#shop/infrastructure/controllers/category/destroy_shop_category.controller')
const UpdateShopCategoryController = () =>
  import('#shop/infrastructure/controllers/category/update_shop_category.controller')
const StoreShopProductController = () =>
  import('#shop/infrastructure/controllers/product/store_shop_product.controller')
const DestroyShopProductController = () =>
  import('#shop/infrastructure/controllers/product/destroy_shop_product.controller')
const UpdateShopProductController = () =>
  import('#shop/infrastructure/controllers/product/update_shop_product.controller')
const CharactersController = () =>
  import('#character/infrastructure/controllers/characters.controller')
const PromotionsController = () =>
  import('#school/infrastructure/controllers/promotions.controller')
const SubjectsController = () => import('#school/infrastructure/controllers/subjects.controller')
const ShopsController = () => import('#shop/infrastructure/controllers/shops.controller')

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
      .delete('schools/:schoolId/shop/categories/:categoryId/products/:productId', [
        DestroyShopProductController,
      ])
      .where('schoolId', onlyNumbersRegex)
      .where('categoryId', onlyNumbersRegex)
      .where('productId', onlyNumbersRegex)
    router
      .patch('schools/:schoolId/shop/categories/:categoryId/products/:productId', [
        UpdateShopProductController,
      ])
      .where('schoolId', onlyNumbersRegex)
      .where('categoryId', onlyNumbersRegex)
      .where('productId', onlyNumbersRegex)

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
