import { Request, Response } from 'express' // importa Request y Response de express
import User from '../models/user' // importa el modelo User
import { hashPassword } from '../utils/auth'

export const createAccount = async(req: Request, res: Response) => { 
    //console.log(req.body)

    const {email, password} = req.body // extrae el email del cuerpo de la petición
    const userExists = await User.findOne({email}) // busca un usuario con el email proporcionado
    if (userExists) { // si el usuario ya existe
        const error = new Error('El usuario ya existe') // crea un nuevo error
        return res.status(409).json({error: error.message}) // devuelve un error 400
    }
    
    const user = new User(req.body) // crea una instancia del modelo User con los datos del cuerpo de la petición
    user.password = await hashPassword(password) // hashea la contraseña antes de guardarla

    //await User.create(req.body) // crea un nuevo usuario
    await user.save() // guarda el usuario en la base de datos

    //res.status(201).json({message: 'Usuario creado correctamente', user}) // devuelve una respuesta con el usuario creado
    res.send("Usuario creado correctamente") // devuelve una respuesta con el usuario creado
}