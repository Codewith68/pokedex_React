import axios from "axios";
import { mapPokemonCard } from "./pokemonApi";

async function downloadPokemons(url, limit = 20) {
  const response = await axios.get(url);
  let pokemonResults = response.data.results || response.data.pokemon || [];
  pokemonResults = pokemonResults.slice(0, limit);

  const pokemonPromises = pokemonResults.map((item) => {
    if (item.url) {
      return axios.get(item.url);
    }

    if (item.pokemon?.url) {
      return axios.get(item.pokemon.url);
    }

    return Promise.resolve(null);
  });

  const pokemonListData = await axios.all(pokemonPromises);
  const pokemonList = pokemonListData
    .filter(Boolean)
    .map((pokemonData) => mapPokemonCard(pokemonData.data));

  return {
    pokemonList,
    nextUrl: response.data.next || "",
    prevUrl: response.data.previous || "",
    totalCount: response.data.count || 0,
  };
}

export default downloadPokemons;
