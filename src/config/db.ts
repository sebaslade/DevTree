import mongoose from "mongoose"

//console.log(process.env.MONGO_URI)

export const connectDB = async () => {
    try {
        //const url = '' 
        const connection = await mongoose.connect(process.env.MONGO_URI)
        //console.log(connection)
        const url2 = '{$connection.host}:${connection.port}'
        console.log('MongoDB connected:', connection.connection.host, connection.connection.name);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}