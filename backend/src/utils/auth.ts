import bcrypt from 'bcrypt';

export const hashPassword = async(password: string)=> {
    // console.log('Hashing password...');
    const salt = await bcrypt.genSalt(10); // Genera un salt con 10 rondas
    return await bcrypt.hash(password, salt); // Hashea la contraseña con el salt generado
}

export const checkPassword = async(enteredPassword: string, hash: string) => {
    return await bcrypt.compare(enteredPassword, hash); // Compara la contraseña ingresada con el hash almacenado
    // console.log(enteredPassword)
    // console.log(hash)
}