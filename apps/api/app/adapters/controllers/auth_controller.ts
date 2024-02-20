import { CreateTokenService } from '#domainServices/user/create_token.service'
import { CreateUserService } from '#domainServices/user/create_user.service'
import { VerifyCredentialsService } from '#domainServices/user/verify_credentials.service'
import { loginUserValidator } from '#validators/login_user'
import { registerUserValidator } from '#validators/register_user'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { StatusCodes } from 'http-status-codes'

@inject()
export default class AuthController {
  constructor(
    private readonly createUserService: CreateUserService,
    private readonly createTokenService: CreateTokenService,
    private readonly verifyCredentialsService: VerifyCredentialsService
  ) {}
  async register({ request, response }: HttpContext) {
    const payload = await registerUserValidator.validate(request.all())

    const user = await this.createUserService.createUser(payload)

    return response.status(StatusCodes.CREATED).send({
      id: user.id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    })
  }

  async login({ request }: HttpContext) {
    const { email, password } = await loginUserValidator.validate(request.all())

    const user = await this.verifyCredentialsService.verifyCredentials(email, password)
    const token = await this.createTokenService.createToken(user)

    return token
  }
}
