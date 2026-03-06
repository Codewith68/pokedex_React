import { useEffect, useMemo, useState } from "react";
import downloadPokemons from "../utils/downloadPokemons";

function getOffsetFromUrl(url) {
  try {
    const parsedUrl = new URL(url);
    return Number(parsedUrl.searchParams.get("offset") || 0);
  } catch {
    return 0;
  }
}

function usePokemonList(defaultUrl, pageSize = 20) {
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
          setError("Unable to fetch Pokemon list.");
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
  }, [defaultUrl, pageSize, pokemonListState.pokedexUrl]);

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
    goToNextPage,
    goToPrevPage,
    setPokemonListState,
  };
}

export default usePokemonList;
