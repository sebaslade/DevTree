import { Link } from 'react-router-dom';

export default function LoginView() {
    return (
        <>
            <h1 className='text-center text-4x1 text-white font-bold'>Iniciar Sesión</h1>
            <nav className='mt-10'>
                <Link className='text-center ■text-white text-lg block' to="/auth/register">
                    ¿No tienes cuenta? Cree una aquí
                </Link>
            </nav>
        </>
    );
}
