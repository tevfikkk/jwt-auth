import mongoose from 'mongoose'
import config from 'config'

const dbUrl = `mongodb://${config.get<string>('dbName')}:${config.get<string>(
    'dbPass'
)}@localhost:6000/jwtAuth?authSource=admin`

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
