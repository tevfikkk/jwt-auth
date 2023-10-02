import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken'
import config from 'config'

const privateKey = ''

/**
 * @description Sign a JWT token with the given payload and options
 * @param payload The payload to sign
 * @param options The options to sign the payload with
 * @returns The signed JWT token
 *
 */
export const signJwt = (
    payload: {},
    options: SignOptions = {}
): string | JwtPayload => {
    const privateKey = Buffer.from(
        config.get<string>('accessTokenPrivateKey'),
        'base64'
    ).toString('ascii')

    return jwt.sign(payload, privateKey, {
        ...(options && options),
        algorithm: 'HS256',
    })
}

/**
 * @description Verify a JWT token
 * @param token The token to verify
 * @returns The decoded token or null if the token is invalid or expired
 */
export const verifyJwt = <T>(token: string): T | null => {
    try {
        const publicKey = Buffer.from(
            config.get<string>('accessTokenPublicKey'),
            'base64'
        ).toString('ascii')

        return jwt.verify(token, publicKey) as T
    } catch (error: unknown) {
        // when returns null, the token is invalid or expired
        return null
    }
}
