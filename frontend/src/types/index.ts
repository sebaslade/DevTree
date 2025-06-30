export type User = { 
    handle: string
    name: string 
    email: string
}

//Pick permite seleccionar otros atributos de otro type
export type RegisterForm = Pick<User, 'handle'| 'email' | 'name'> & { 
    password: string
    password_confirmation: string
}
