import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import FavoriteController from '#controllers/favorite_controller'

export default function favoriteRoutes() {
  router
    .group(() => {
      router.get('/', [FavoriteController, 'showForAuthUser'])
      router.get('/:id', [FavoriteController, 'show'])
      router.post('/', [FavoriteController, 'store'])
      router.delete('/:id', [FavoriteController, 'destroy'])
    })
    .prefix('/favorites')
    .use(middleware.auth())
}
