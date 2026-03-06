import { Link } from 'react-router-dom'
import usePokemonList from '../../hooks/usePokemonList'

const DEFAULT_URL = 'https://pokeapi.co/api/v2/pokemon?limit=20&offset=0'

function PokemonList({ searchTerm }) {
    const {
      pokemonListState,
      isLoading,
      error,
      pageInfo,
      canGoPrev,
      canGoNext,
      isSearchMode,
      goToPrevPage,
      goToNextPage,
    } = usePokemonList(DEFAULT_URL, 20, searchTerm)

  return (
    <div className='mx-auto w-full max-w-6xl'>
      <div className='mb-6 text-center'>
        <h2 className='text-xl font-bold text-slate-800 md:text-2xl'>
          {isSearchMode ? 'Search Results' : 'List of all Pokemons'}
        </h2>
        <p className='mt-1 text-sm text-slate-500'>
          Showing {pageInfo.start} - {pageInfo.end} of {pageInfo.total}
        </p>
      </div>

      {isLoading ? (
        <p className='rounded-xl bg-black p-6 text-center text-lg font-medium text-white shadow-sm'>Loading...</p>
      ) : error ? (
        <p className='rounded-xl bg-red-100 p-6 text-center text-lg font-medium text-red-500 shadow-sm'>{error}</p>
      ) : (
        <>
          <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
            {pokemonListState.pokemonList.map((pokemon)=>{
              return (
                <Link key={pokemon.id} to={`/pokemon/${pokemon.name}`} className='block'>
                  <article className='rounded-xl border-b-gray-800 border-2 bg-black p-4 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg'>
                    <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100'>
                      <img src={pokemon.image} alt={pokemon.name} className='h-12.5 w-12.5 object-contain'/>
                    </div>
                    <h3 className='mt-3 text-base font-bold capitalize text-white hover:text-emerald-300'>{pokemon.name}</h3>
                    <div className='mt-3 flex flex-wrap items-center justify-center gap-2'>
                      {pokemon.types.map((type)=>{
                        return (
                          <span key={`${pokemon.name}-${type}`} className='rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold capitalize text-emerald-700'>
                            {type}
                          </span>
                        )
                      })}
                    </div>
                  </article>
                </Link>
              )
            })}
          </div>

          {!isSearchMode && (
            <div className='mt-8 flex items-center justify-center gap-3'>
              <button
                type='button'
                onClick={goToPrevPage}
                disabled={!canGoPrev}
                className=' bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300'
              >
                Prev
              </button>
              <button
                type='button'
                onClick={goToNextPage}
                disabled={!canGoNext}
                className=' bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-emerald-200'
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default PokemonList
