import { Link } from 'react-router-dom'
import usePokemon from '../../hooks/usePokemon'

function PokemonDetails() {
  const { pokemon, pokemonListState, isLoading, error } = usePokemon()

  return (
    <div className='mx-auto mt-10 w-full max-w-3xl rounded-xl bg-black p-8 text-white shadow-lg'>
      <Link to='/' className='inline-block rounded bg-emerald-500 px-4 py-2 font-semibold text-black'>
             BACK TO POKEDEX OR HOME
      </Link>

      {isLoading ? (
        <p className='mt-6 text-center text-lg font-semibold'>Loading details...</p>
      ) : error ? (
        <p className='mt-6 text-center text-lg font-semibold text-red-400'>{error}</p>
      ) : (
        <div className='mt-6'>
          <div className='flex flex-col items-center gap-4 border-b border-slate-700 pb-6 text-center'>
            <img src={pokemon.image} alt={pokemon.name} className='h-36 w-36 object-contain' />
            <h2 className='text-3xl font-bold capitalize'>
              {pokemon.name} <span className='text-slate-400'>#{pokemon.id}</span>
            </h2>
            <div className='flex flex-wrap justify-center gap-2'>
              {pokemon.types.map((type) => (
                <span key={type} className='rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold capitalize text-emerald-700'>
                  {type}
                </span>
              ))}
            </div>
          </div>

          <div className='mt-6 grid gap-6 md:grid-cols-2'>
            <div>
              <h3 className='text-lg font-semibold'>Basics</h3>
              <p className='mt-2 text-slate-300'>Height: {pokemon.height}</p>
              <p className='text-slate-300'>Weight: {pokemon.weight}</p>
              <p className='mt-2 text-slate-300 capitalize'>Abilities: {pokemon.abilities.join(', ')}</p>
            </div>

            <div>
              <h3 className='text-lg font-semibold'>Base Stats</h3>
              <div className='mt-2 space-y-2'>
                {pokemon.stats.map((stat) => (
                  <div key={stat.name} className='flex items-center justify-between rounded bg-slate-800 px-3 py-2'>
                    <span className='capitalize text-slate-200'>{stat.name}</span>
                    <span className='font-semibold'>{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className='mt-8'>
            <h3 className='mb-3 text-lg font-semibold'>More {pokemon.types[0]} Type Pokemons</h3>
            <div className='flex flex-wrap gap-2'>
              {pokemonListState.pokemonList
                .filter((relatedPokemon) => relatedPokemon.name !== pokemon.name)
                .slice(0, 12)
                .map((relatedPokemon) => (
                  <Link
                    key={relatedPokemon.id}
                    to={`/pokemon/${relatedPokemon.name}`}
                    className='rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold capitalize text-emerald-700'
                  >
                    {relatedPokemon.name}
                  </Link>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PokemonDetails
