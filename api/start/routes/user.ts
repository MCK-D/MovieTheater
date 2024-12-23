import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import UserController from '#controllers/user_controller'

export default function userRoutes() {
  router
    .group(() => {
      router.get('/me', [UserController, 'me'])
    })
    .prefix('user')
    .use(middleware.auth())

}
