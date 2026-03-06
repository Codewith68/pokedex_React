import { useEffect, useMemo, useState } from "react";
import downloadPokemons from "../utils/downloadPokemons";
import useDebounce from "./useDebounce";
import { fetchPokemonByIdOrName, mapPokemonCard } from "../utils/pokemonApi";

function getOffsetFromUrl(url) {
  try {
    const parsedUrl = new URL(url);
    return Number(parsedUrl.searchParams.get("offset") || 0);
  } catch {
    return 0;
  }
}

function usePokemonList(defaultUrl, pageSize = 20, searchTerm = "") {
  const debouncedSearchTerm = useDebounce(searchTerm, 1000);
  const normalizedSearchTerm = debouncedSearchTerm.trim().toLowerCase();

  const [pokemonListState, setPokemonListState] = useState({
    pokemonList: [],
    pokedexUrl: defaultUrl,
    nextUrl: "",
    prevUrl: "",
    totalCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const fetchPokemons = async () => {
      try {
        setIsLoading(true);
        setError("");

        if (normalizedSearchTerm) {
          const pokemonData = await fetchPokemonByIdOrName(normalizedSearchTerm);

          if (ignore) return;

          setPokemonListState((prev) => ({
            ...prev,
            pokemonList: [mapPokemonCard(pokemonData)],
            nextUrl: "",
            prevUrl: "",
            totalCount: 1,
          }));
          return;
        }

        const data = await downloadPokemons(
          pokemonListState.pokedexUrl || defaultUrl,
          pageSize
        );

        if (ignore) return;

        setPokemonListState((prev) => ({
          ...prev,
          pokemonList: data.pokemonList,
          nextUrl: data.nextUrl,
          prevUrl: data.prevUrl,
          totalCount: data.totalCount,
        }));
      } catch {
        if (!ignore) {
          setError(
            normalizedSearchTerm
              ? `No pokemon found for "${normalizedSearchTerm}".`
              : "Unable to fetch Pokemon list."
          );
          setPokemonListState((prev) => ({ ...prev, pokemonList: [] }));
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    fetchPokemons();

    return () => {
      ignore = true;
    };
  }, [defaultUrl, normalizedSearchTerm, pageSize, pokemonListState.pokedexUrl]);

  const pageInfo = useMemo(() => {
    const offset = getOffsetFromUrl(pokemonListState.pokedexUrl || defaultUrl);
    const hasTotal = pokemonListState.totalCount > 0;

    if (!pokemonListState.pokemonList.length) {
      return { start: 0, end: 0, total: pokemonListState.totalCount };
    }

    return {
      start: hasTotal ? offset + 1 : 1,
      end: hasTotal
        ? Math.min(offset + pokemonListState.pokemonList.length, pokemonListState.totalCount)
        : pokemonListState.pokemonList.length,
      total: pokemonListState.totalCount,
    };
  }, [defaultUrl, pokemonListState.pokedexUrl, pokemonListState.pokemonList.length, pokemonListState.totalCount]);

  const goToNextPage = () => {
    if (!pokemonListState.nextUrl) return;
    setPokemonListState((prev) => ({ ...prev, pokedexUrl: prev.nextUrl }));
  };

  const goToPrevPage = () => {
    if (!pokemonListState.prevUrl) return;
    setPokemonListState((prev) => ({ ...prev, pokedexUrl: prev.prevUrl }));
  };

  return {
    pokemonListState,
    isLoading,
    error,
    pageInfo,
    canGoNext: Boolean(pokemonListState.nextUrl),
    canGoPrev: Boolean(pokemonListState.prevUrl),
    isSearchMode: Boolean(normalizedSearchTerm),
    goToNextPage,
    goToPrevPage,
    setPokemonListState,
  };
}

export default usePokemonList;
