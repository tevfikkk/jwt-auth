import { Router } from 'express'
import {
    getAllUsersHandler,
    getMeHandler,
} from '../controllers/user.controller'
import { deserializeUser } from '../middleware/deserializeUser'
import { requireUser } from '../middleware/requireUser'
import { restrictTo } from '../middleware/restrictTo'

export const router = Router() as Router

// All routes in this file require a valid access token
router.use(deserializeUser, requireUser)

// Getting all users (only for admin)
router.get('/', restrictTo('admin'), getAllUsersHandler)

// Getting the current user
router.get('/me', getMeHandler)
