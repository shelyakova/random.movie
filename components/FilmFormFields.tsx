import FormInput from "./FormInput";
import Textarea from "./Textarea";
import MultiSelectDropdown from "./MultiSelectDropdown";
import DatePicker from "./DatePicker";
import { Category } from "@/lib/types/category";
import { TmdbSearchResult } from "@/lib/types";
import TmdbSearchDropdown from "./TmdbSearchDropdown";
import { FilmFormState } from "@/hooks/useFilmModal";

interface FilmFormFieldsProps {
  form: FilmFormState;
  categories: Category[];
  onTmdbSelect: (result: TmdbSearchResult) => void;
}

export default function FilmFormFields({ form, categories, onTmdbSelect }: FilmFormFieldsProps) {
  const {
    register,
    errors,
    name,
    onNameChange,
    categoryIds,
    setCategoryIds,
    newSeason,
    setNewSeason,
    latestEpisode,
    setLatestEpisode,
  } = form;

  const toNumberOrUndefined = (v: string) => (v === "" ? undefined : Number(v));

  return (
    <>
      <TmdbSearchDropdown
        value={name ?? ""}
        onQueryChange={onNameChange}
        onSelect={onTmdbSelect}
        label="Name"
        placeholder="Name"
        error={!!errors.name}
        errorMessage={errors.name?.message}
      />

      <MultiSelectDropdown
        options={categories}
        selectedIds={categoryIds ?? []}
        onChange={setCategoryIds}
        label="Categories"
        placeholder="Categories"
        error={!!errors.categoryIds}
        errorMessage={errors.categoryIds?.message}
      />

      <div className="flex items-center gap-3">
        <FormInput
          type="number"
          label="Seasons"
          placeholder="Seasons"
          className="flex-1"
          error={!!errors.seasons}
          errorMessage={errors.seasons?.message}
          {...register("seasons", { setValueAs: toNumberOrUndefined })}
        />
        <FormInput
          type="number"
          label="Episodes"
          placeholder="Episods"
          className="flex-1"
          error={!!errors.episodes}
          errorMessage={errors.episodes?.message}
          {...register("episodes", { setValueAs: toNumberOrUndefined })}
        />
        <FormInput
          type="number"
          label="Duration in minutes"
          placeholder="Duration(min)"
          className="flex-1"
          error={!!errors.duration}
          errorMessage={errors.duration?.message}
          {...register("duration", { setValueAs: toNumberOrUndefined })}
        />
      </div>

      <div className="flex items-center gap-3">
        <DatePicker
          label="New season date"
          placeholder="New season"
          value={newSeason}
          onChange={setNewSeason}
          className="flex-1"
        />
        <DatePicker
          label="Latest episode date"
          placeholder="Latest episode"
          value={latestEpisode}
          onChange={setLatestEpisode}
          className="flex-1"
          isRightPopupOriented
        />
      </div>

      <Textarea
        label="Description"
        placeholder="Description"
        error={!!errors.description}
        errorMessage={errors.description?.message}
        {...register("description")}
      />

      <div className="flex items-center gap-3">
        <FormInput
          type="number"
          label="Year"
          placeholder="Year"
          className="flex-1"
          error={!!errors.year}
          errorMessage={errors.year?.message}
          {...register("year", { setValueAs: toNumberOrUndefined })}
        />
        <FormInput
          type="number"
          step="0.01"
          label="Mark"
          placeholder="Mark"
          className="flex-1"
          error={!!errors.mark}
          errorMessage={errors.mark?.message}
          {...register("mark", { setValueAs: toNumberOrUndefined })}
        />
      </div>

      <FormInput
        label="Link"
        placeholder="Link"
        {...register("link")}
        error={!!errors.link}
        errorMessage={errors.link?.message}
      />
    </>
  );
}
