import React, { useEffect, useState } from 'react'
import axios from 'axios'
function PokemonList() {
    
    const[pokemonList, setPokemonList]=useState([])
    const [isLoading, setIsLoading]=useState(true)
    const fetchPokemons = async () => {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon') // tbis download all pokemons
        const results=response.data.results // we get the array of pokemon from the list 


        // now iterating over the array of pokemon and usong their url to create an array of promises 
        // that will downloas the 20 pokemons
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
    },[])
  return (
    <>
    <div className='mx-8 my-0 text-center text-2xl'>
        list of all pokemons  
        {isLoading ?<p>Loading...</p> : pokemonList.map((pokemon,index)=>{
            return <div key={index} className='flex flex-col items-center justify-center w-250 my-4'>
                <img src={pokemon.image} alt={pokemon.name} className='w-50 h-50 object-contain'/>
                <h2 className='text-center text-2xl'>{pokemon.name}</h2>
                <p className='text-center text-lg'>{pokemon.types.join(', ')}</p>
            </div>
        })}
    </div>
    </>
  )
}

export default PokemonList
