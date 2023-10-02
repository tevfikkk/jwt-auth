require('dotenv').config()
import express, { Application, Request, Response, NextFunction } from 'express'
import config from 'config'
import { connectDB } from './utils/connectDB'
import morgan from 'morgan'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { router as userRouter } from './routes/user.route'
import { router as authRouter } from './routes/auth.route'

const app: Application = express()

const port = config.get<number>('port')

// Middlewares

// Body Parser
app.use(express.json({ limit: '10kb' }))

// Cookie Parser
app.use(cookieParser())

// Logger
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// CORS
app.use(
    cors({
        origin: config.get<string>('origin'),
        credentials: true,
    })
)

// Routes
app.use('/api/users', userRouter)
app.use('/api/auth', authRouter)

// Checking if server is running
app.get('/HealthCheck', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'Server is running',
    })
})

// Unknown route handler
app.all('*', (req: Request, res: Response, next: NextFunction) => {
    const err = new Error(`Route ${req.originalUrl} not found`) as any
    err.statusCode = 404
    next(err)
})

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    err.status = err.status || 'error'
    err.statusCode = err.statusCode || 500

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    })
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)

    connectDB()
})
