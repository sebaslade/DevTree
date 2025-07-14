import { Request, Response } from 'express' // importa Request y Response de express
import { validationResult } from 'express-validator'
import User from '../models/user' // importa el modelo User
import { checkPassword, hashPassword } from '../utils/auth'
import { generateJWT } from '../utils/jwt' // importa la función para generar JWT
import jwt from 'jsonwebtoken' // importa jwt para verificar el token
import slug from 'slug'

export const createAccount = async(req: Request, res: Response) => { 
    const {email, password} = req.body // extrae el email del cuerpo de la petición
    const userExists = await User.findOne({email}) // busca un usuario con el email proporcionado
    if (userExists) { // si el usuario ya existe
        const error = new Error('El usuario ya existe') // crea un nuevo error
        return res.status(409).json({error: error.message}) // devuelve un error 400
    }
    
    const handle = slug(req.body.handle, '') // genera un slug a partir del handle proporcionado)
    const handleExists = await User.findOne({handle}) // busca un usuario con el email proporcionado
    if (handleExists) { // si el handle ya existe
        const error = new Error('Nombre de usuario no disponible') // crea un nuevo error
        return res.status(409).json({error: error.message}) // devuelve un error 400
    }

    const user = new User(req.body) // crea una instancia del modelo User con los datos del cuerpo de la petición
    user.password = await hashPassword(password) // hashea la contraseña antes de guardarla
    user.handle = handle // asigna el handle generado al usuario

    //await User.create(req.body) // crea un nuevo usuario
    await user.save() // guarda el usuario en la base de datos

    //res.status(201).json({message: 'Usuario creado correctamente', user}) // devuelve una respuesta con el usuario creado
    res.status(201).send("Usuario creado correctamente") // devuelve una respuesta con el usuario creado
}

export const login = async(req: Request, res: Response) => {
    //Manejo de errores
    let errors = validationResult(req) // valida los datos de la petición
    if(!errors.isEmpty()) { 
        return res.status(400).json({error: errors.array()}) // si hay errores de validación, devuelve un error 400 con los errores
    }// si hay errores de validación

    const {email, password} = req.body // extrae el email del cuerpo de la petición
    const user = await User.findOne({email}) // busca un usuario con el email proporcionado
    if (!user) { // si el usuario ya existe
        const error = new Error('El usuario no esta registrado') // crea un nuevo error
        return res.status(404).json({error: error.message}) // devuelve un error 400
    }
    const isPasswordCorrect = await checkPassword(password, user.password) // verifica si la contraseña es correcta
    if (!isPasswordCorrect) {
        const error = new Error('Contraseña incorrecta')
        return res.status(401).json({error: error.message})
    }
    // Generar JWT
    const token = generateJWT({id: user._id}) // genera un token JWT para el usuario
    res.status(200).json({ token }) 
    //res.status(200).send("Login exitoso")
}

export const getUser = async(req: Request, res: Response) => {
    const user = (req as any).user
    res.json(user)
}