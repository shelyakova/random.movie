import FormInput from "./FormInput";
import Textarea from "./Textarea";
import MultiSelectDropdown from "./MultiSelectDropdown";
import DatePicker from "./DatePicker";
import { Category } from "@/lib/types/category";
import { TmdbSearchResult } from "@/lib/types";
import TmdbSearchDropdown from "./TmdbSearchDropdown";
import { FilmFormState } from "@/hooks/useFilmModal";
import { useTranslations } from "next-intl";

interface FilmFormFieldsProps {
  form: FilmFormState;
  categories: Category[];
  onTmdbSelect: (result: TmdbSearchResult) => void;
}

export default function FilmFormFields({ form, categories, onTmdbSelect }: FilmFormFieldsProps) {
  const t = useTranslations("film.fields");
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
        label={t("name")}
        placeholder={t("name")}
        error={!!errors.name}
        errorMessage={errors.name?.message}
      />

      <MultiSelectDropdown
        options={categories}
        selectedIds={categoryIds ?? []}
        onChange={setCategoryIds}
        label={t("categories")}
        placeholder={t("categories")}
        error={!!errors.categoryIds}
        errorMessage={errors.categoryIds?.message}
      />

      <div className="flex items-center gap-3">
        <FormInput
          type="number"
          label={t("seasons")}
          placeholder={t("seasons")}
          className="flex-1"
          error={!!errors.seasons}
          errorMessage={errors.seasons?.message}
          {...register("seasons", { setValueAs: toNumberOrUndefined })}
        />
        <FormInput
          type="number"
          label={t("episodes")}
          placeholder={t("episodes")}
          className="flex-1"
          error={!!errors.episodes}
          errorMessage={errors.episodes?.message}
          {...register("episodes", { setValueAs: toNumberOrUndefined })}
        />
        <FormInput
          type="number"
          label={t("durationLabel")}
          placeholder={t("durationPlaceholder")}
          className="flex-1"
          error={!!errors.duration}
          errorMessage={errors.duration?.message}
          {...register("duration", { setValueAs: toNumberOrUndefined })}
        />
      </div>

      <div className="flex items-center gap-3">
        <DatePicker
          label={t("newSeasonLabel")}
          placeholder={t("newSeasonPlaceholder")}
          value={newSeason}
          onChange={setNewSeason}
          className="flex-1"
        />
        <DatePicker
          label={t("latestEpisodeLabel")}
          placeholder={t("latestEpisodePlaceholder")}
          value={latestEpisode}
          onChange={setLatestEpisode}
          className="flex-1"
          isRightPopupOriented
        />
      </div>

      <Textarea
        label={t("description")}
        placeholder={t("description")}
        error={!!errors.description}
        errorMessage={errors.description?.message}
        {...register("description")}
      />

      <div className="flex items-center gap-3">
        <FormInput
          type="number"
          label={t("year")}
          placeholder={t("year")}
          className="flex-1"
          error={!!errors.year}
          errorMessage={errors.year?.message}
          {...register("year", { setValueAs: toNumberOrUndefined })}
        />
        <FormInput
          type="number"
          step="0.01"
          label={t("mark")}
          placeholder={t("mark")}
          className="flex-1"
          error={!!errors.mark}
          errorMessage={errors.mark?.message}
          {...register("mark", { setValueAs: toNumberOrUndefined })}
        />
      </div>

      <FormInput
        label={t("link")}
        placeholder={t("link")}
        {...register("link")}
        error={!!errors.link}
        errorMessage={errors.link?.message}
      />
    </>
  );
}
