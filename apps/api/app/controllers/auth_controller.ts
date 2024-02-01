import User from '#models/user'
import { loginUserValidator } from '#validators/login_user'
import { registerUserValidator } from '#validators/register_user'
import { HttpContext } from '@adonisjs/core/http'
import { StatusCodes } from 'http-status-codes'
import hash from '@adonisjs/core/services/hash'

export default class AuthController {
  async register({ request, response }: HttpContext) {
    const payload = await registerUserValidator.validate(request.all())
    const userCreated = await User.create(payload)
    return response.status(StatusCodes.CREATED).send(userCreated)
  }

  async login({ auth, response, request }: HttpContext) {
    const { email, password } = await loginUserValidator.validate(request.all())

    const user = await User.findByOrFail('email', email)

    const isPasswordValid = await hash.verify(user.password, password)

    if (!isPasswordValid) {
      return response.abort({ error: { message: 'Invalid credentials' } }, StatusCodes.UNAUTHORIZED)
    }

    const token = await User.accessTokens.create(user)
    return token
  }
}
