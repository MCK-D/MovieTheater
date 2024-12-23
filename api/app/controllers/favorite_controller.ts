import Favorite from '#models/favorite'
import type { HttpContext } from '@adonisjs/core/http'

export default class FavoriteController {
  async store({ request, response, auth }: HttpContext) {
    const user = auth.getUserOrFail()
    const data = request.only(['movie_id'])
    const newFavorite = {
      userId: user.id,
      id: data.movie_id,
    }
    await Favorite.create(newFavorite)
    const favorites = await Favorite.query().where('userId', user.id)
    return response.status(201).json(favorites)
  }

  async show({ params, response }: HttpContext) {
    const { id } = params
    const favorite = await Favorite.findByOrFail('id', id)
    return response.json(favorite)
  }

  async destroy({ params, response }: HttpContext) {
    const { id } = params
    const favorite = await Favorite.findByOrFail('id', id)
    await favorite.delete()

    return response.json({ message: 'Favorite deleted' })
  }

  async showForAuthUser({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const favorites = await Favorite.query().where('userId', user.id)
    return response.json(favorites)
  }
}
