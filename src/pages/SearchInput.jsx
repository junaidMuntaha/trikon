const SearchInput = ({ value, onChange, placeholder = 'সার্চ করুন...' }) => {
  return (
    <div className="w-full max-w-2xl mx-auto mb-6">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-5 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg"
      />
    </div>
  )
}

export default SearchInput
    