import mongoose, { Schema, Document, Types } from 'mongoose';

interface IUser {
    handle: string
    name: string
    email: string
    password: string
    description: string
    image: string
    links: string
    visits: number
    followers: Types.ObjectId[]
    following: Types.ObjectId[]
}

export interface UserDocument extends IUser, Document {
    _id: Types.ObjectId
}

const userSchema = new Schema<UserDocument>({
    //Atributos
    handle:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
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
    },
    description: {
        type: String,
        default: ''
    },
    image: {
        type: String,
        default: ''
    },
    links: {
        type: String,
        default: '[]'
    },
    visits: {
        type: Number,
        default: 0
    },
    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: Schema.Types.ObjectId, ref: 'User' }]
})

//Creamos el modelo
const UserModel = mongoose.model<UserDocument>('User', userSchema);
//Exportamos el modelo
export default UserModel;