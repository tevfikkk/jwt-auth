import { object, string, TypeOf } from 'zod'

export const createUserSchema = object({
    body: object({
        name: string({ required_error: 'Name is required' }),
        email: string({ required_error: 'Email is required' }).email({
            message: 'Not a valid email',
        }),
        password: string({ required_error: 'Password is required' })
            .min(8, { message: 'Password must be at least 8 characters long' })
            .max(32, {
                message: 'Password must not be longer than 32 characters',
            }),
        passwordConfirm: string({
            required_error: 'Please confirm your password',
        }),
    }).refine(data => data.password === data.passwordConfirm, {
        path: ['passwordConfirm'],
        message: 'Passwords do not match',
    }),
})

export const loginUserSchema = object({
    body: object({
        email: string({ required_error: 'Email is required' }).email({
            message: 'Not a valid email',
        }),
        password: string({ required_error: 'Password is required' }).min(8, {
            message: 'Password must be at least 8 characters long',
        }),
    }),
})

export type CreateUserInput = TypeOf<typeof createUserSchema>['body']
export type LoginUserInput = TypeOf<typeof loginUserSchema>['body']
