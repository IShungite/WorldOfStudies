import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import { getFullUrl } from '#shared/infra/api/utils/get_url'
import { CreateSchoolService } from '#school/domain/services/school/create_school.service'
import { GetSchoolService } from '#school/domain/services/school/get_school.service'
import { DeleteSchoolService } from '#school/domain/services/school/delete_school.service'
import { DeleteSubjectService } from '#school/domain/services/subject/delete_subject.service'
import { UpdateSchoolService } from '#school/domain/services/school/update_school.service'
import { GetShopBySchoolService } from '#shop/domain/services/get_shop_by_school.service'
import { UpdateSubjectService } from '#school/domain/services/subject/update_subject.service'
import { DeletePromotionService } from '#school/domain/services/promotion/delete_promotion.service'
import { UpdatePromotionService } from '#school/domain/services/promotion/update_promotion.service'
import { DeleteShopService } from '#shop/domain/services/delete_shop.service'
import { createSchoolValidator } from '#school/infrastructure/validators/school/create_school.validator'
import { domainIdValidator } from '#shared/id/infrastructure/validators/domain_id.validator'
import { SchoolMapper } from '#school/infrastructure/mappers/school.mapper'
import { updateSchoolValidator } from '#school/infrastructure/validators/school/update_school.validator'
import { updateSubjectValidator } from '#school/infrastructure/validators/update_subject.validator'
import { SubjectApiMapper } from '#school/infrastructure/mappers/subject_api.mapper'
import { ShopApiMapper } from '#shop/infrastructure/mappers/shop_api.mapper'
import { updatePromotionValidator } from '#school/infrastructure/validators/update_promotion.validator'
import { UserStorageMapper } from '#user/infrastructure/mappers/user_storage.mapper'

@inject()
export default class SchoolsController {
  constructor(
    private readonly createSchoolService: CreateSchoolService,
    private readonly getSchoolService: GetSchoolService,
    private readonly deleteSchoolService: DeleteSchoolService,
    private readonly deleteSubjectService: DeleteSubjectService,
    private readonly updateSchoolService: UpdateSchoolService,
    private readonly getShopBySchoolService: GetShopBySchoolService,
    private readonly updateSubjectService: UpdateSubjectService,
    private readonly deletePromotionService: DeletePromotionService,
    private readonly updatePromotionService: UpdatePromotionService,
    private readonly deleteShopService: DeleteShopService
  ) {}

  async store({ request, response }: HttpContext) {
    const payload = await vine.validate({ schema: createSchoolValidator, data: request.all() })
    const school = await this.createSchoolService.execute(payload)

    return response.created(school)
  }

  async show({ params }: HttpContext) {
    const id = await vine.validate({ schema: domainIdValidator, data: params.id })
    const school = await this.getSchoolService.execute(id)
    return SchoolMapper.toResponse(school)
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, auth }: HttpContext) {
    const userEntity = await auth.authenticate()
    const user = UserStorageMapper.fromLucid(userEntity)

    const [id, payload] = await Promise.all([
      vine.validate({ schema: domainIdValidator, data: params.id }),
      vine.validate({ schema: updateSchoolValidator, data: request.all() }),
    ])

    const school = await this.updateSchoolService.execute(id, user, payload)
    return SchoolMapper.toResponse(school)
  }

  /**
   * Delete record
   */
  async destroy({ params, response, auth }: HttpContext) {
    const userEntity = await auth.authenticate()
    const user = UserStorageMapper.fromLucid(userEntity)

    const id = await vine.validate({ schema: domainIdValidator, data: params.id })

    await this.deleteSchoolService.execute(id, user)

    return response.noContent()
  }

  /**
   * Delete subject within a school
   */

  async destroySubject({ params }: HttpContext) {
    const [idSchool, idSubject, idPromotion] = await Promise.all([
      vine.validate({
        schema: domainIdValidator,
        data: params.idSchool,
      }),
      vine.validate({
        schema: domainIdValidator,
        data: params.idPromotion,
      }),
      vine.validate({
        schema: domainIdValidator,
        data: params.idSubject,
      }),
    ])

    await this.deleteSubjectService.execute(idSchool, idSubject, idPromotion)
  }

  async updateSubject({ params, request, response }: HttpContext) {
    const [idSchool, idSubject, idPromotion] = await Promise.all([
      vine.validate({
        schema: domainIdValidator,
        data: params.idSchool,
      }),
      vine.validate({
        schema: domainIdValidator,
        data: params.idPromotion,
      }),
      vine.validate({
        schema: domainIdValidator,
        data: params.idSubject,
      }),
    ])

    const payload = await vine.validate({ schema: updateSubjectValidator, data: request.all() })

    const subject = await this.updateSubjectService.execute(
      idSchool,
      idSubject,
      idPromotion,
      payload
    )

    return response.ok(SubjectApiMapper.toResponse(subject))
  }

  async getShop({ params, response }: HttpContext) {
    const id = await vine.validate({ schema: domainIdValidator, data: params.id })
    const shop = await this.getShopBySchoolService.execute(id)
    return response.ok(ShopApiMapper.toResponse(shop))
  }

  async destroyShop({ params, response }: HttpContext) {
    const id = await vine.validate({ schema: domainIdValidator, data: params.id })

    await this.deleteShopService.execute(id)

    return response.noContent()
  }

  /**
   * Delete promotion within a school
   */
  async destroyPromotion({ params, response }: HttpContext) {
    const [idSchool, idSubject] = await Promise.all([
      vine.validate({
        schema: domainIdValidator,
        data: params.idSchool,
      }),
      vine.validate({
        schema: domainIdValidator,
        data: params.idPromotion,
      }),
    ])

    await this.deletePromotionService.execute(idSchool, idSubject)

    return response.noContent()
  }

  async updatePromotion({ params, response, request }: HttpContext) {
    const [idSchool, idPromotion] = await Promise.all([
      vine.validate({
        schema: domainIdValidator,
        data: params.idSchool,
      }),
      vine.validate({
        schema: domainIdValidator,
        data: params.idPromotion,
      }),
    ])

    const payload = await vine.validate({ schema: updatePromotionValidator, data: request.all() })

    await this.updatePromotionService.execute(idSchool, idPromotion, payload)

    return response
      .append('location', getFullUrl(`/api/schools/${idSchool}/promotions/${idPromotion}`))
      .noContent()
  }
}
