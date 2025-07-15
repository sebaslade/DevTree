//const express = require('express') //CJS Common JS
import express from 'express' // ESM ecmascript modules
import cors from 'cors' // para permitir peticiones de otros dominios
import 'dotenv/config' // para leer el archivo .env
import router from './router'
import {connectDB} from './config/db'
import {corsConfig} from './config/cors'

// conexión a la base de datos
connectDB()

// instancia del servidor
const app = express()

app.get('/', (req, res) => {
  res.send('¡Servidor funcionando correctamente! 🚀');
});


//Cors: Middleware para permitir peticiones de otros dominios
app.use(cors(corsConfig))

//Leer datos del formulario
app.use(express.json())

//app.get('/', router)
app.use('/', router) //cada que hay une petición a la url principal se ejecuta a router

export default app