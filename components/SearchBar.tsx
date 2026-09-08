import { SearchIcon } from "./icons";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative w-full max-w-xl">
      <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-zinc-500">
        <SearchIcon />
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type="text"
        placeholder="Search a movie or a series"
        className="w-full rounded-full border border-zinc-200 bg-white py-2.5 pr-4 pl-11 text-sm text-black placeholder-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
      />
    </div>
  );
}
