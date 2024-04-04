import { CreateSchoolService } from '#domain/services/school/create_school.service'
import { DeleteSchoolService } from '#domain/services/school/delete_school.service'
import { GetSchoolService } from '#domain/services/school/get_school.service'
import { UpdateSchoolService } from '#domain/services/school/update_school.service'
import { DeleteSubjectService } from '#domain/services/subject/delete_subject.service'
import { SchoolMapper } from '#infrastructure/mappers/school.mapper'
import { createSchoolValidator } from '#infrastructure/validators/school/create_school.validator'
import { domainIdValidator } from '#infrastructure/validators/domain_id.validator'
import { updateSchoolValidator } from '#infrastructure/validators/school/update_school.validator'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import { ShopMapper } from '#infrastructure/mappers/shop.mapper'
import { GetShopBySchoolService } from '#domain/services/shop/get_shop_by_school.service'
import { SubjectMapper } from '#infrastructure/mappers/subject.mapper'
import { updateSubjectValidator } from '#infrastructure/validators/update_subject.validator'
import { UpdateSubjectService } from '#domain/services/subject/update_subject.service'
import { DeletePromotionService } from '#domain/services/promotion/delete_promotion.service'
import { UpdatePromotionService } from '#domain/services/promotion/update_promotion.service'
import { updatePromotionValidator } from '#infrastructure/validators/update_promotion.validator'
import { getUrl } from '#utils/get_url'
import { DeleteShopService } from '#domain/services/shop/delete_shop.service'

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
  async update({ params, request }: HttpContext) {
    const id = await vine.validate({ schema: domainIdValidator, data: params.id })
    const payload = await vine.validate({ schema: updateSchoolValidator, data: request.all() })

    const school = await this.updateSchoolService.execute(id, payload)
    return SchoolMapper.toResponse(school)
  }

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    const id = await vine.validate({ schema: domainIdValidator, data: params.id })

    await this.deleteSchoolService.execute(id)

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

    return response.ok(SubjectMapper.toResponse(subject))
  }

  async getShop({ params, response }: HttpContext) {
    const id = await vine.validate({ schema: domainIdValidator, data: params.id })
    const shop = await this.getShopBySchoolService.execute(id)
    return response.ok(ShopMapper.toResponse(shop))
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
      .append('location', getUrl(`schools/${idSchool}/promotions/${idPromotion}`))
      .noContent()
  }
}