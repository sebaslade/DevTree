import { Link } from "react-router-dom";

export default function RegisterView() {
    return (
        <>
            <h1 className='text-center text-4xl text-white font-bold'>Crear cuenta</h1> 
            <form 
                onSubmit={() => {}} 
                className="bg-white px-5 py-20 rounded-lg space-y-10 mt-10 max-w-md mx-auto"> 
                <div className="grid grid-cols-1 space-y-3">
                    <label htmlFor="name" className="text-2xl text-slate-500">Nombre</label>
                    <input
                        id="name" type="text"
                        placeholder="Tu Nombre"
                        className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
                    />
                </div>
                <div className="grid grid-cols-1 space-y-3">
                    <label htmlFor="email" className="text-2xl text-slate-500">E-mail</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="Email de registro"
                        className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
                    />
                </div>
                <div className="grid grid-cols-1 space-y-3">
                    <label htmlFor="handle" className="text-2xl text-slate-500">Handle</label> 
                    <input
                        id="handle" 
                        type="text"
                        placeholder="Nombre de usuario: sin espacios"
                        className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
                    />
                </div>
                <div className="grid grid-cols-1 space-y-3">
                    <label htmlFor="password" className="text-2xl text-slate-500">Password</label>
                    <input
                        id="password" 
                        type="password"
                        placeholder="Password de registro"
                        className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
                    />
                </div>
                <div className="grid grid-cols-1 space-y-3">
                    <label htmlFor="password_confirmation" className="text-2xl text-slate-500">Repetir Password</label>
                    <input
                        id="password" 
                        type="password"
                        placeholder="Repetir tu password"
                        className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
                    />
                </div>
                <input
                    type="submit"
                    className="bg-cyan-400 p-3 text-lg w-full uppercase text-slate-600 rounded-lg font-bold"
                    value="Crear Cuenta"
                />
            </form>
            <nav className='mt-10'>
                <Link className='text-center text-white text-lg block' to="/auth/login"> 
                    ¿Ya tienes una cuenta? Inicia Sesión.
                </Link>
            </nav>

        </>
    );
}