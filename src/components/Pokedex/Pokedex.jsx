import PokemonList from "../PokemonList/PokemonList"
import Search from "../search/Search"

function Pokedex() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-gray-700 to-gray-900 px-4 py-10">
      <section className="mx-auto w-full max-w-6xl  border border-white/60 bg-white/80 p-6 shadow-xl backdrop-blur-sm md:p-10">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Pokemon Explorer</p>
          <h1 className="mt-2 text-4xl font-black text-slate-900 md:text-5xl">Pokedex</h1>
          <p className="mt-2 text-sm text-slate-600 md:text-base">Search and browse your favorite Pokemon cards</p>
        </div>

        <Search />
        <PokemonList />
      </section>
    </main>
  )
}

export default Pokedex
