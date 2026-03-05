import { Route, Routes } from 'react-router-dom'
import Pokedex from '../components/Pokedex/Pokedex'
import PokemonDetails from '../components/PokemonDetails/PokemonDetails'

const NotFound = () => (
  <div className='p-6 text-center text-lg font-semibold'>404 - Page Not Found</div>
)

function CustomRoutes() {
  return (
    <Routes>
      <Route path='/' element={<Pokedex />} />
      <Route path='/pokemon/:id' element={<PokemonDetails />} />
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default CustomRoutes
