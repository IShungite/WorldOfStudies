import { CreateSchoolService } from '../../domain/services/school/create_school.service.js'
import { DeleteSchoolService } from '../../domain/services/school/delete_school.service.js'
import { GetSchoolService } from '../../domain/services/school/get_school.service.js'
import { UpdateSchoolService } from '../../domain/services/school/update_school.service.js'
import { DeleteSubjectService } from '../../domain/services/subject/delete_subject.service.js'
import { SchoolMapper } from '../mappers/school.mapper.js'
import { createSchoolValidator } from '../validators/school/create_school.validator'
import { domainIdValidator } from '../../../shared/id/infrastructure/validators/domain_id.validator.js'
import { updateSchoolValidator } from '../validators/school/update_school.validator'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import { ShopApiMapper } from '../../../shop/infrastructure/mappers/shop_api.mapper.js'
import { GetShopBySchoolService } from '../../../shop/domain/services/get_shop_by_school.service.js'
import { SubjectMapper } from '../mappers/subject.mapper.js'
import { updateSubjectValidator } from '../validators/update_subject.validator.js'
import { UpdateSubjectService } from '../../domain/services/subject/update_subject.service.js'
import { DeletePromotionService } from '../../domain/services/promotion/delete_promotion.service.js'
import { UpdatePromotionService } from '../../domain/services/promotion/update_promotion.service.js'
import { updatePromotionValidator } from '../validators/update_promotion.validator.js'
import { getUrl } from '#utils/get_url'
import { DeleteShopService } from '../../../shop/domain/services/delete_shop.service.js'

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
      .append('location', getUrl(`schools/${idSchool}/promotions/${idPromotion}`))
      .noContent()
  }
}
