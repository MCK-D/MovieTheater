import { HttpContext } from '@adonisjs/core/http'

export default class UserController {
  async me({ auth, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      return response.json(user)
    } catch {
      return response.badRequest('Invalid credentials')
    }
  }
}
