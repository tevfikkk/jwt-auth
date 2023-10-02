import { Router } from 'express'
import { loginHandler, registerHandler } from '../controllers/auth.controller'
import { validate } from '../middleware/validate'
import { createUserSchema, loginUserSchema } from '../schema/user.schema'

export const router = Router() as Router

// Register user route
router.post('/register', validate(createUserSchema), registerHandler)

// Login user route
router.post('/login', validate(loginUserSchema), loginHandler)
