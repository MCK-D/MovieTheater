/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import authRoutes from '#start/routes/auth'
import userRoutes from './routes/user.js'
import favoriteRoutes from './routes/favorite.js'

router.group(() => {
  authRoutes()
  userRoutes()
  favoriteRoutes()
}).prefix('api')
