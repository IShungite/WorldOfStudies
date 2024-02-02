import User from '#models/user'
import { loginUserValidator } from '#validators/login_user'
import { registerUserValidator } from '#validators/register_user'
import { HttpContext } from '@adonisjs/core/http'
import { StatusCodes } from 'http-status-codes'

export default class AuthController {
  async register({ request, response }: HttpContext) {
    const payload = await registerUserValidator.validate(request.all())
    const userCreated = await User.create(payload)
    return response.status(StatusCodes.CREATED).send(userCreated)
  }

  async login({ response, request }: HttpContext) {
    const { email, password } = await loginUserValidator.validate(request.all())

    const user = await User.verifyCredentials(email, password)

    const token = await User.accessTokens.create(user)
    return token
  }
}
