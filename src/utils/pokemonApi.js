import axios from "axios";

export const POKEMON_API_BASE_URL = "https://pokeapi.co/api/v2";

export function getPokemonImage(sprites) {
  return (
    sprites?.other?.["official-artwork"]?.front_default ||
    sprites?.other?.dream_world?.front_default ||
    sprites?.front_default ||
    ""
  );
}

export function mapPokemonCard(data) {
  return {
    id: data.id,
    name: data.name,
    image: getPokemonImage(data.sprites),
    types: data.types.map((type) => type.type.name),
  };
}

export function mapPokemonDetails(data) {
  return {
    id: data.id,
    name: data.name,
    image: getPokemonImage(data.sprites),
    height: data.height,
    weight: data.weight,
    types: data.types.map((type) => type.type.name),
    abilities: data.abilities.map((ability) => ability.ability.name),
    stats: data.stats.map((stat) => ({
      name: stat.stat.name,
      value: stat.base_stat,
    })),
  };
}

export async function fetchPokemonByIdOrName(idOrName) {
  const response = await axios.get(
    `${POKEMON_API_BASE_URL}/pokemon/${String(idOrName).toLowerCase()}`
  );
  return response.data;
}
