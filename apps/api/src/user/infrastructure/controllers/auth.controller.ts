import { CreateTokenService } from '../../domain/services/create_token.service.js'
import { CreateUserService } from '../../domain/services/create_user.service.js'
import { VerifyCredentialsService } from '../../domain/services/verify_credentials.service.js'
import { UserApiMapper } from '../mappers/user_api.mapper.js'
import { loginUserValidator } from '../validators/login_user.validator.js'
import { registerUserValidator } from '../validators/register_user.validator.js'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'

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
