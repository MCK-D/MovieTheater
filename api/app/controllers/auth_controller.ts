import { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import { LoginValidator, RegisterValidator } from '#validators/user'

export default class AuthController {
  async login({ request, response }: HttpContext) {
    try {
      await request.validateUsing(LoginValidator)

      const data = request.all()

      const { email, password } = data

      const user = await User.query().where('email', email).first()
      if (!user) {
        return response.badRequest({ message: 'Invalid credentials' })
      }

      const isValid = await hash.verify(user.password, password)
      if (!isValid) {
        return response.badRequest({ message: 'Invalid credentials' })
      }

      const accessToken = await User.accessTokens.create(user)

      return response.ok({
        message: 'Login successful',
        accessToken: accessToken.value!.release(),
        user
      })
    } catch (error) {
      if (error.messages) {
        return response.badRequest({ message: 'Validation failed', errors: error.messages })
      }
      return response.badRequest({ message: 'Error logging in' })
    }
  }

  async register({ request, response }: HttpContext) {
    try {
      await request.validateUsing(RegisterValidator)
      const data = request.all()

      const { email, password } = data

      if (await User.query().where('email', email).first()) {
        return response.badRequest({
          message: 'Email already registered',
        })
      }
      const user = new User()
      user.email = email
      user.password = password
      await user.save()

      const accessToken = await User.accessTokens.create(user)

      response.status(201)
      return response.send({
        message: 'User registered successfully',
        accessToken: accessToken.value!.release(),
        user
      })
    } catch (error) {
      if (error.messages) {
        return response.badRequest({ message: 'Validation failed', errors: error.messages })
      }
      const email = request.input('email')

      await User.query().where('email', email).delete()

      console.error('Error registering user:', error.message)
      return response.badRequest({ message: 'Error registering user' })
    }
  }
}
