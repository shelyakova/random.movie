import SearchBar from "./SearchBar";
import Logo from "./Logo";
import { SettingsIcon, SmileyIcon, LogoutIcon, PlusIcon } from "./icons";
import { IconButton, Tone } from "./IconButton";

interface HeaderProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onOpenLogoutConfirmModal: () => void;
  onOpenCategoriesModal: () => void;
  onOpenFilmModal: () => void;
  onClickRandomize: () => void;
}

export default function Header({ searchValue, onSearchChange, onOpenLogoutConfirmModal, onOpenCategoriesModal, onOpenFilmModal, onClickRandomize }: HeaderProps) {
  return (
    <header className="grid grid-cols-[1fr_3fr_1fr] w-full items-center gap-4 py-11">
      <div className="justify-self-start">
        <Logo />
      </div>

      <div className="flex items-center gap-5 justify-center">
        <IconButton onClick={onOpenCategoriesModal}>
          <SettingsIcon />
        </IconButton>

        <SearchBar value={searchValue} onChange={onSearchChange} />

        <IconButton tone={Tone.Accent} onClick={onClickRandomize}>
          <SmileyIcon />
        </IconButton>

        <IconButton onClick={onOpenLogoutConfirmModal}>
          <LogoutIcon />
        </IconButton>
      </div>

      <div className="justify-self-end">
        <IconButton onClick={onOpenFilmModal}>
          <PlusIcon />
        </IconButton>
      </div>
    </header>
  );
}
