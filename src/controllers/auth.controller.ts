import config from 'config'
import { CookieOptions, NextFunction, Request, Response } from 'express'
import { CreateUserInput, LoginUserInput } from '../schema/user.schema'
import { createUser, findUser, signToken } from '../services/user.service'
import { AppError } from '../utils/appError'

import { IUser } from '../interfaces/IUser'

// Excluding fields from the response
export const excludedFields = ['password']

// Cookie options
const accessTokenCookieOptions: CookieOptions = {
    expires: new Date(
        Date.now() + config.get<number>('accessTokenExpiresIn') * 60 * 1000
    ),
    maxAge: config.get<number>('accessTokenExpiresIn') * 60 * 1000,
    httpOnly: true,
    sameSite: 'lax',
}

// Setting secure cookie in production
if (process.env.NODE_ENV === 'production') {
    accessTokenCookieOptions.secure = true
}

// Register a user
export const registerHandler = async (
    req: Request<{}, {}, CreateUserInput>,
    res: Response,
    next: NextFunction
) => {
    try {
        const { email, name, password } = req.body as unknown as IUser

        const user = await createUser({ email, name, password })

        res.status(201).json({
            status: 'ok',
            data: {
                user,
            },
        })
    } catch (error: any) {
        if (error.code === 11000) {
            return res.status(409).json({
                status: 'error',
                message: 'User already exists',
            })
        }

        next(error)
    }
}

// Login a user
export const loginHandler = async (
    req: Request<{}, {}, LoginUserInput>,
    res: Response,
    next: NextFunction
) => {
    try {
        // Fetch the user from the database
        const user = await findUser({
            email: req.body.email as unknown as string,
        })

        // Check if user exists and password is correct
        if (
            !user ||
            !(await user.comparePasswords(
                user.password as unknown as string,
                req.body.password as unknown as string
            ))
        ) {
            return next(new AppError('Invalid email or password', 401))
        }

        // Create an Access Token
        const { access_token } = await signToken(user)

        // Send Access Token in Cookie
        res.cookie('access_token', access_token, accessTokenCookieOptions)
        res.cookie('logged_in', true, {
            ...accessTokenCookieOptions,
            httpOnly: false,
        })

        res.status(200).json({
            status: 'ok',
            access_token,
        })
    } catch (error: any) {
        next(error)
    }
}
