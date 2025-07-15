import { Request, Response } from 'express' // importa Request y Response de express
import { validationResult } from 'express-validator'
import User, { UserDocument } from '../models/user' // importa el modelo User
import { checkPassword, hashPassword } from '../utils/auth'
import { generateJWT } from '../utils/jwt' // importa la función para generar JWT
import { v4 as uuid } from 'uuid'
import slug from 'slug'
import formidable from 'formidable'
import cloudinary from '../config/cloudinary'
import mongoose, { Types } from 'mongoose'

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
    res.json(req.user)
}

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const { description, links } = req.body

        const handle = slug(req.body.handle, '')
        const handleExists = await User.findOne({ handle })
        if (handleExists && handleExists.email !== req.user.email) {
            const error = new Error('Nombre de usuario no disponible')
            res.status(409).json({ error: error.message })
        }

        // Actualizar el usuario
        req.user.description = description
        req.user.handle = handle
        req.user.links = links
        await req.user.save()
        res.send('Perfil Actualizado Correctamente')

    } catch (e) {
        const error = new Error('Hubo un error')
        res.status(500).json({ error: error.message })
    }
}

export const uploadImage = async (req: Request, res: Response) => {
    const form = formidable({ multiples: false })
    try {
        form.parse(req, (error, fields, files) => {
            cloudinary.uploader.upload(files.file[0].filepath, { public_id: uuid() }, async function (error, result) {
                if (error) {
                    const error = new Error('Hubo un error al subir la imagen')
                    res.status(500).json({ error: error.message })
                }
                if (result) {
                    req.user.image = result.secure_url
                    await req.user.save()
                    res.json({ image: result.secure_url })
                }
            })
        })
    } catch (e) {
        const error = new Error('Hubo un error')
        res.status(500).json({ error: error.message })
    }
}

export const getUserByHandle = async (req: Request, res: Response): Promise<void> => {
    try {
        const { handle: userHandle } = req.params

        const user = await User.findOne({ handle: userHandle })
        if (!user) {
            res.status(404).json({ error: 'El Usuario no existe' });
            return; 
        }

        user.visits += 1; // Incrementa el contador de visitas
        await user.save(); // Guarda el usuario actualizado
        
        const currentUser = req.user as UserDocument | undefined

         const isFollowing = currentUser
            ? user.followers.some((followerId) => followerId.equals(currentUser._id))
            : false

        const { name, image, description, links, handle, visits, followers, following } = user.toObject()
        res.json({ name, image, description, links, handle, visits, 
            followersCount: followers.length,
            followingCount: following.length,
            followers: followers,
            following: following,
            isFollowing
            
        })
    } catch (e) {
        const error = new Error('Hubo un error')
        res.status(500).json({ error: error.message })
    }
}

export const searchByHandle = async (req: Request, res: Response): Promise<void> => {
    try {
        const { handle } = req.body;
        const userExists = await User.findOne({ handle });

        if (userExists) {
            res.status(409).json({ error: `${handle} ya está registrado` });
            return;
        }

        res.send(`${handle} está disponible`);
    } catch (e) {
        res.status(500).json({ error: 'Hubo un error' });
    }
}

export const followUser = async (req: Request, res: Response) => {
    try {
        const { handle } = req.params;
        const currentUser = req.user as UserDocument;

        if (!currentUser) {
            res.status(401).json({ error: 'No autenticado' });
        }

        const targetUser = await User.findOne({ handle });
        if (!targetUser) {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Evitar seguirse a sí mismo
        if (targetUser._id.toString() === currentUser._id.toString()) {
            res.status(400).json({ error: 'No puedes seguirte a ti mismo' });
        }

        // Verificar si ya sigue
        const alreadyFollowing = targetUser.followers.some(
            id => id.toString() === currentUser._id.toString()
        );

        if (alreadyFollowing) {
            res.json({ message: 'Ya sigues a este usuario' });
        }

        await User.updateOne(
            { _id: targetUser._id },
            { $addToSet: { followers: currentUser._id } }
        );

        await User.updateOne(
            { _id: currentUser._id },
            { $addToSet: { following: targetUser._id } }
        );
        res.json({ message: `Ahora sigues a @${targetUser.handle}` });

    } catch (e) {
        res.status(500).json({ error: 'Hubo un error' })
    }
}

export const unfollowUser = async (req: Request, res: Response) => {
    try {
        const { handle } = req.params
        const targetUser = await User.findOne({ handle })

        if (!targetUser) {
            res.status(404).json({ error: 'El usuario no existe' })
        }

        const currentUser = await User.findById(req.user._id)

        if (!currentUser) {
            res.status(401).json({ error: 'No autorizado' })
        }

        const targetId = targetUser._id as Types.ObjectId
        const currentId = currentUser._id as Types.ObjectId

        currentUser.following = currentUser.following.filter(id =>
            !(id as Types.ObjectId).equals(targetId)
        )
        targetUser.followers = targetUser.followers.filter(id =>
            !(id as Types.ObjectId).equals(currentId)
        )

        await currentUser.save()
        await targetUser.save()

        res.json({ message: `Has dejado de seguir a @${targetUser.handle}` })
    } catch (e) {
        res.status(500).json({ error: 'Hubo un error' })
    }
}

export const searchUsersPreview = async (req: Request, res: Response): Promise<void> => {
  try {
    const q = req.query.q as string
    if (!q || q.trim() === '') {
      res.json([])
      return
    }

    const regex = new RegExp(`^${q}`, 'i')

    const users = await User.find({ handle: regex })
      .select('handle name image')
      .limit(10)

    res.json(users)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Hubo un error al buscar usuarios' })
  }
}
