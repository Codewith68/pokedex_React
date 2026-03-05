import React, { useEffect, useState } from 'react'
import axios from 'axios'

const PAGE_SIZE = 20

function PokemonList() {
    
    const[pokemonList, setPokemonList]=useState([])
    const [isLoading, setIsLoading]=useState(true)
    const [offset, setOffset] = useState(0)
    const [totalCount, setTotalCount] = useState(0)

    const fetchPokemons = async () => {
        setIsLoading(true)
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon', {
            params: { limit: PAGE_SIZE, offset }
        }) // this downloads paginated pokemons
        const results=response.data.results // we get the array of pokemon from the list 
        setTotalCount(response.data.count)


        // now iterating over the array of pokemon and usong their url to create an array of promises 
        // that will download the current 20 pokemons
        const pokemonData=await axios.all(results.map(async(pokemon)=>{
            const response = await axios.get(pokemon.url) // this will download the details of each pokemon
            const sprites = response.data.sprites
            const image =
                sprites.other?.['official-artwork']?.front_default ||
                sprites.other?.dream_world?.front_default ||
                sprites.front_default

            return {
                name:pokemon.name,
                image,
                types:response.data.types.map((type)=>type.type.name)
            }
        }))
        setPokemonList(pokemonData)
        setIsLoading(false)
    }
    useEffect(()=>{
        fetchPokemons()
    },[offset])

    const handlePrev = () => {
        setOffset((prevOffset) => Math.max(prevOffset - PAGE_SIZE, 0))
    }

    const handleNext = () => {
        setOffset((prevOffset) => prevOffset + PAGE_SIZE)
    }

    const canGoPrev = offset > 0
    const canGoNext = offset + PAGE_SIZE < totalCount

  return (
    <div className='mx-auto w-full max-w-6xl'>
      <div className='mb-6 text-center'>
        <h2 className='text-xl font-bold text-slate-800 md:text-2xl'>List of all Pokemons</h2>
        <p className='mt-1 text-sm text-slate-500'>
          Showing {offset + 1} - {Math.min(offset + PAGE_SIZE, totalCount)} of {totalCount}
        </p>
      </div>

      {isLoading ? (
        <p className='rounded-xl bg-black p-6 text-center text-lg font-medium text-white shadow-sm'>Loading...</p>
      ) : (
        <>
          <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
            {pokemonList.map((pokemon,index)=>{
              return (
                <article key={index} className='rounded-xl border-b-gray-800 border-2 bg-black p-4 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg'>
                  <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100'>
                    <img src={pokemon.image} alt={pokemon.name} className='h-[50px] w-[50px] object-contain'/>
                  </div>
                  <h3 className='mt-3 text-base font-bold capitalize text-white'>{pokemon.name}</h3>
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
              )
            })}
          </div>

          <div className='mt-8 flex items-center justify-center gap-3'>
            <button
              type='button'
              onClick={handlePrev}
              disabled={!canGoPrev}
              className=' bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300'
            >
              Prev
            </button>
            <button
              type='button'
              onClick={handleNext}
              disabled={!canGoNext}
              className=' bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-emerald-200'
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default PokemonList
