import mongoose, { Schema } from 'mongoose';

interface IUser {
    name: string;
    email: string;
    password: string;
}

const userSchema = new Schema({
    //Atributos
    name:{
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    }
})

//Creamos el modelo
const UserModel = mongoose.model<IUser>('User', userSchema);
//Exportamos el modelo
export default UserModel;