import mongoose from "mongoose"
import colors from "colors"

//console.log(process.env.MONGO_URI)

export const connectDB = async () => {
    try {
        //const url = '' 
        const {connection} = await mongoose.connect(process.env.MONGO_URI)
        //console.log(connection)
        const url = `${connection.host}:${connection.port}`
        console.log(colors.cyan.bold( `MongoDB Conectado en ${url}`) )
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}