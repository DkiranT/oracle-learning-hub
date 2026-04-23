import { useEffect, useState } from "react";
import { Search } from "lucide-react";

const SearchBar = ({
  initialValue = "",
  placeholder = "What do you want to learn?",
  onSearch,
  buttonLabel = "Search"
}) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(value.trim());
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="group flex w-full flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-soft transition focus-within:-translate-y-0.5 focus-within:shadow-hover sm:flex-row sm:items-center"
    >
      <div className="flex flex-1 items-center gap-2 rounded-xl bg-slate-50 px-3 py-2">
        <Search className="text-slate-500" size={18} />
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={placeholder}
          className="w-full border-none bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 sm:text-base"
        />
      </div>
      <button
        type="submit"
        className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
      >
        {buttonLabel}
      </button>
    </form>
  );
};

export default SearchBar;
