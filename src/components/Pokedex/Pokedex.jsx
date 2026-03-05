import PokemonList from "../PokemonList/PokemonList"
import Search from "../search/Search"

function Pokedex() {
  return (
    <>
    <div className='flex flex-col w-250'>
    <h1 className="mx-auto my-0 text-center text-2xl space-x-2">Pokedex</h1>
    <Search/>
    <PokemonList/>
    </div>
    </>
  )
}

export default Pokedex