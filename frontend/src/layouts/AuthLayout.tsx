import {Outlet} from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div className='bg-slate-800 min-h-screen'>
            <div className='max-w-lg mx-auto pt-10 px-5'>
                <img src="/logo.svg" alt="Logotipo Devtree" />
            </div>
            <div className='py-10'>
                <Outlet />
            </div>
    </div>
  )
}
