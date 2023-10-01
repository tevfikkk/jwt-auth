import { createClient } from 'redis'

const redisUrl = `redis://localhost:6379`
const redisClient = createClient({
    url: redisUrl,
})

const connectRedis = async () => {
    try {
        await redisClient.connect()
        console.log('Redis connected...')
    } catch (error: unknown) {
        console.log(error)
        setTimeout(connectRedis, 2000)
    }
}

connectRedis()

redisClient.on('error', err => console.log(err))

export default redisClient
