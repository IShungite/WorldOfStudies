import User from '#models/user'
import { RegisterUserValidator } from '#validators/register_user'
import { HttpContext } from '@adonisjs/core/http'
import { StatusCodes } from 'http-status-codes'
export default class AuthController {
  async register({ request, response }: HttpContext) {
    const payload = await RegisterUserValidator.validate(request.all())
    const userCreated = await User.create(payload)
    return response.status(StatusCodes.CREATED).send(userCreated)
  }

  async login({ request }: HttpContext) {
    return this.login.name
  }
}
