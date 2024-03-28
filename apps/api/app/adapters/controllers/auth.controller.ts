import { CreateTokenService } from '#domainServices/user/create_token.service'
import { CreateUserService } from '#domainServices/user/create_user.service'
import { VerifyCredentialsService } from '#domainServices/user/verify_credentials.service'
import { UserMapper } from '#mappers/user.mapper'
import { loginUserValidator } from '#validators/login_user.validator'
import { registerUserValidator } from '#validators/register_user.validator'
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
    return response.created(UserMapper.toResponse(user))
  }

  async login({ request }: HttpContext) {
    const { email, password } = await vine.validate({
      schema: loginUserValidator,
      data: request.all(),
    })

    const user = await this.verifyCredentialsService.execute(email, password)
    const token = await this.createTokenService.execute(user)

    return token
  }
}
