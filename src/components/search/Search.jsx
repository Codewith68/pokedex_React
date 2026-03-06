
function Search({ value, onChange }) {
  return (
    <div className="mx-auto mb-8 w-full max-w-2xl">
      <div className="  border-slate-200 bg-white p-2 shadow-sm">
        <input
          className="w-full rounded-xl border-none bg-slate-50 px-4 py-3 text-base text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search pokemon name..."
        />
      </div>
    </div>
  )
}

export default Search
