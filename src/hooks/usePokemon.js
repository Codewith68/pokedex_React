import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import downloadPokemons from "../utils/downloadPokemons";
import {
  POKEMON_API_BASE_URL,
  fetchPokemonByIdOrName,
  mapPokemonDetails,
} from "../utils/pokemonApi";

function usePokemon(pokemonName) {
  const { id } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [pokemonListState, setPokemonListState] = useState({
    pokemonList: [],
    pokedexUrl: "",
    nextUrl: "",
    prevUrl: "",
    totalCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const downloadPokemonAndRelated = async () => {
      try {
        setIsLoading(true);
        setError("");
        const target = pokemonName || id;
        const data = await fetchPokemonByIdOrName(target);

        if (ignore) return;

        setPokemon(mapPokemonDetails(data));
        const firstType = data.types?.[0]?.type?.name;

        if (firstType) {
          const relatedData = await downloadPokemons(
            `${POKEMON_API_BASE_URL}/type/${firstType}`,
            20
          );
          if (!ignore) {
            setPokemonListState((prev) => ({
              ...prev,
              pokedexUrl: `${POKEMON_API_BASE_URL}/type/${firstType}`,
              pokemonList: relatedData.pokemonList,
              nextUrl: relatedData.nextUrl,
              prevUrl: relatedData.prevUrl,
              totalCount: relatedData.totalCount,
            }));
          }
        } else if (!ignore) {
          setPokemonListState((prev) => ({ ...prev, pokemonList: [] }));
        }
      } catch {
        if (!ignore) {
          setError("Pokemon not found.");
          setPokemon(null);
          setPokemonListState((prev) => ({ ...prev, pokemonList: [] }));
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    downloadPokemonAndRelated();
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });

    return () => {
      ignore = true;
    };
  }, [id, pokemonName]);

  return { pokemon, pokemonListState, isLoading, error };
}

export default usePokemon;
