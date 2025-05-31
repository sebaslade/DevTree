import { Router, Request, Response } from 'express'
// ermite configurar un objeto con todas las rutas que despues podemos agregar a la app principal server.ts
import User from './models/user'
import { createAccount } from './handlers/index'

const router = Router()

// Autenticacion
router.post('/auth/register', (req: Request, res: Response) => {
  createAccount(req, res);
}) // Ruta para crear una cuenta de usuario

export default router