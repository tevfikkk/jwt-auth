import { Request, Response, NextFunction } from 'express'
import { AnyZodObject, ZodError } from 'zod'

export const validate =
    (schema: AnyZodObject) =>
    (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse({
                params: req.params,
                query: req.query,
                body: req.body,
            })

            next()
        } catch (error: unknown) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    status: 'fail',
                    error: {
                        message: 'Validation failed',
                        details: error.errors.map(err => ({
                            path: err.path,
                            message: err.message,
                        })),
                    },
                })
            }

            next(error)
        }
    }
