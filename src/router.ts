import {Router} from 'express'
// ermite configurar un objeto con todas las rutas que despues podemos agregar a la app principal server.ts

const router = Router()

// Autenticacion
router.post('/auth/register', (req, res) => {
    console.log(req.body)
})

export default router