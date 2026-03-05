import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useParams } from 'react-router-dom'

function PokemonDetails() {
  const { id } = useParams()
  const [pokemon, setPokemon] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let ignore = false

    const fetchPokemonDetails = async () => {
      try {
        setIsLoading(true)
        setError('')
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id.toLowerCase()}`)

        if (ignore) return

        const data = response.data
        const sprites = data.sprites
        const image =
          sprites.other?.['official-artwork']?.front_default ||
          sprites.other?.dream_world?.front_default ||
          sprites.front_default

        setPokemon({
          id: data.id,
          name: data.name,
          image,
          height: data.height,
          weight: data.weight,
          types: data.types.map((type) => type.type.name),
          abilities: data.abilities.map((ability) => ability.ability.name),
          stats: data.stats.map((stat) => ({
            name: stat.stat.name,
            value: stat.base_stat,
          })),
        })
      } catch {
        if (!ignore) {
          setError('Pokemon not found.')
          setPokemon(null)
        }
      } finally {
        if (!ignore) {
          setIsLoading(false)
        }
      }
    }

    fetchPokemonDetails()

    return () => {
      ignore = true
    }
  }, [id])

  return (
    <div className='mx-auto mt-10 w-full max-w-3xl rounded-xl bg-black p-8 text-white shadow-lg'>
      <Link to='/' className='inline-block rounded bg-emerald-500 px-4 py-2 font-semibold text-black'>
        Back to Home
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
        </div>
      )}
    </div>
  )
}

export default PokemonDetails
