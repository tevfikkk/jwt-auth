import mongoose from 'mongoose'
import config from 'config'
import dotenv from 'dotenv'

dotenv.config()

const dbUrl = process.env.MONGO_DB_URL as string

export const connectDB = async () => {
    try {
        await mongoose.connect(dbUrl)
        console.log('MongoDB connected')
    } catch (error: unknown) {
        console.log(error)
        setTimeout(connectDB, 2000)
        throw new Error('Error connecting to MongoDB')
    }
}
