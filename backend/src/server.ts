//const express = require('express') //CJS Common JS
import express from 'express' // ESM ecmascript modules
import 'dotenv/config' // para leer el archivo .env
import router from './router'
import {connectDB} from './config/db'

// instancia del servidor
const app = express()

// conexión a la base de datos
connectDB()

//Leer datos del formulario
app.use(express.json())

//app.get('/', router)
app.use('/', router) //cada que hay une petición a la url principal se ejecuta a router

export default app