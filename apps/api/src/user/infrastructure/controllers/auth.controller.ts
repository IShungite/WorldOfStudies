import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import { CreateUserService } from '#user/domain/services/create_user.service'
import { CreateTokenService } from '#user/domain/services/create_token.service'
import { VerifyCredentialsService } from '#user/domain/services/verify_credentials.service'
import { registerUserValidator } from '#user/infrastructure/validators/register_user.validator'
import { UserApiMapper } from '#user/infrastructure/mappers/user_api.mapper'
import { loginUserValidator } from '#user/infrastructure/validators/login_user.validator'

@inject()
export default class AuthController {
  constructor(
    private readonly createUserService: CreateUserService,
    private readonly createTokenService: CreateTokenService,
    private readonly verifyCredentialsService: VerifyCredentialsService
  ) {}
  async register({ request, response }: HttpContext) {
    const payload = await vine.validate({ schema: registerUserValidator, data: request.all() })

    const user = await this.createUserService.execute(payload)
    return response.created(UserApiMapper.toResponse(user))
  }

  async login({ request }: HttpContext) {
    const { email, password } = await vine.validate({
      schema: loginUserValidator,
      data: request.all(),
    })

    const user = await this.verifyCredentialsService.execute(email, password)
    return this.createTokenService.execute(user)
  }
}
