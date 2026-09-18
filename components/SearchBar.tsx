import { SearchIcon } from "./icons";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative w-full max-w-xl">
      <span className="text-muted-foreground pointer-events-none absolute top-1/2 left-4 -translate-y-1/2">
        <SearchIcon />
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type="text"
        placeholder="Search a movie or a series"
        className="border-border-subtle bg-surface text-foreground placeholder-muted-foreground w-full rounded-full border py-2.5 pr-4 pl-11 text-sm focus:outline-none"
      />
    </div>
  );
}
