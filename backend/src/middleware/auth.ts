import type {Request, Response, NextFunction} from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/user' // importa el modelo User

export const aunthenticate = async (req: Request, res: Response, next: NextFunction) => {
    const bearer = req.headers.authorization
    if (!bearer) {
        res.status(401).json({ error: 'Token no proporcionado' })
        return
    }

    const [, token] = bearer.split(' ')
    if (!token) {
        res.status(401).json({ error: 'Usuario no autorizado' })
        return
    }

    try {
        const result = jwt.verify(token, process.env.JWT_SECRET!)
        if (typeof result === 'object' && result.id) {
        const user = await User.findById(result.id).select('-password -__v')
        if (!user) {
            res.status(404).json({ error: 'Usuario no existe' })
            return
        }

        ;(req as any).user = user
        return next()
        }
    } catch (error) {
        res.status(401).json({ error: 'Token inválido' })
        return
    }
}
