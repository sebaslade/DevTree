import server from './server'

const port = process.env.PORT || 4000

//Crear servidor
server.listen(port, () =>{
    console.log('Servidor funcionando en el puerto ', port)
})