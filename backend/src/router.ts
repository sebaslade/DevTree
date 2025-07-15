import { Router, Request, Response } from 'express'
// ermite configurar un objeto con todas las rutas que despues podemos agregar a la app principal server.ts
import User from './models/user'
import { createAccount, followUser, getUser, getUserByHandle, login, searchByHandle, searchUsersPreview, unfollowUser, updateProfile, uploadImage } from './handlers/index'
import {body} from 'express-validator' // Importa body y validationResult de express-validator
import { handleInputErrors } from './middleware/validation'
import { authenticate } from './middleware/auth'

const router = Router()

// Autenticacion
router.post('/auth/register', 
  body('handle').notEmpty().withMessage('El nombre de usuario es obligatorio'),
  body('name').notEmpty().withMessage('El nombre es obligatorio'),
  body('email').isEmail().withMessage('El email es obligatorio y debe ser válido'),
  body('password').isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres'),
  handleInputErrors,
  (req: Request, res: Response, next) => {
    Promise.resolve(createAccount(req, res)).catch(next);
  } // Valida que el campo handle no esté vacío
) // Ruta para crear una cuenta de usuario

router.post('/auth/login',
  body('email').isEmail().withMessage('El email es obligatorio y debe ser válido'),
  body('password').notEmpty().withMessage('La contraseña es obligatoria'),
  (req: Request, res: Response, next) => {
    // Aquí iría la lógica de autenticación
    Promise.resolve(login(req, res)).catch(next);
  } // Ruta para iniciar sesión
)

router.get('/user', authenticate, getUser)

router.patch('/user',
    body('handle')
        .notEmpty()
        .withMessage('El handle no puede ir vacio'),
    handleInputErrors,
    authenticate,
    updateProfile
)

router.post('/user/image', authenticate, uploadImage)

router.get('/search', authenticate, searchUsersPreview)

router.get('/:handle', authenticate, getUserByHandle)

router.post('/search',
    body('handle')
        .notEmpty()
        .withMessage('El handle no puede ir vacio'),
    handleInputErrors,
    searchByHandle
)

// Seguir a un usuario
router.post('/follow/:handle', authenticate, followUser)

// Dejar de seguir a un usuario
router.post('/unfollow/:handle', authenticate, unfollowUser)

export default router