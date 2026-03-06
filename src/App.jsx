import './App.css'
import { NavLink } from 'react-router-dom'
import CustomRoutes from './routes/CustomRoutes'

function App() {
  const getNavClass = ({ isActive }) =>
    `rounded px-3 py-1 text-sm font-semibold ${isActive ? 'bg-black text-white' : 'bg-slate-200 text-slate-800'}`

  return (
    <>
      <header className='mx-auto flex w-full max-w-6xl items-center justify-center gap-3 px-4 py-4'>
        <NavLink to='/' className={getNavClass}>
            POKEDEX
        </NavLink>
      </header>
      <CustomRoutes />
    </>
  )
}

export default App
