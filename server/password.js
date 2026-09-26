import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'

const scryptAsync = promisify(scrypt)

export async function hashPassword(password) {
    const salt = randomBytes(16).toString('hex')
    const derivedKey = await scryptAsync(password, salt, 64)

    return `${salt}:${derivedKey.toString('hex')}`
}

export async function verifyPassword(password, savedPassword) {
    const [salt, savedKeyHex] = savedPassword.split(':')

    if (!salt || !savedKeyHex) {
        return false
    }

    const savedKey = Buffer.from(savedKeyHex, 'hex')
    const derivedKey = await scryptAsync(password, salt, 64)

    return savedKey.length === derivedKey.length &&
        timingSafeEqual(savedKey, derivedKey)
}
