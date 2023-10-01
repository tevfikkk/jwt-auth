require('dotenv').config()
import express, { Application } from 'express'
import config from 'config'

import { connectDB } from './utils/connectDB'

const app: Application = express()

const port = config.get<number>('port')

app.get('/HealthCheck', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'Server is running',
    })
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)

    connectDB()
})
