import { UseFormRegister, FieldErrors } from "react-hook-form";
import FormInput from "./FormInput";
import Textarea from "./Textarea";
import MultiSelectDropdown from "./MultiSelectDropdown";
import { FilmSchema } from "@/lib/schemas/film.schema";
import { Category } from "@/lib/types/category";

interface FilmFormFieldsProps {
  register: UseFormRegister<FilmSchema>;
  errors: FieldErrors<FilmSchema>;
  categories: Category[];
  categoryIds: number[] | undefined;
  onCategoryIdsChange: (ids: number[]) => void;
}

export default function FilmFormFields({
  register,
  errors,
  categories,
  categoryIds,
  onCategoryIdsChange,
}: FilmFormFieldsProps) {
  const toNumberOrUndefined = (v: string) => (v === "" ? undefined : Number(v));

  return (
    <>
      <FormInput placeholder="Name" {...register("name")} error={!!errors.name} />

      <MultiSelectDropdown
        options={categories}
        selectedIds={categoryIds ?? []}
        onChange={onCategoryIdsChange}
        placeholder="Categories"
        error={!!errors.categoryIds}
      />

      <div className="flex items-center gap-3">
        <FormInput
          type="number"
          placeholder="Seasons"
          className="flex-1"
          {...register("seasons", { setValueAs: toNumberOrUndefined })}
        />
        <FormInput
          type="number"
          placeholder="Episods"
          className="flex-1"
          {...register("episodes", { setValueAs: toNumberOrUndefined })}
        />
        <FormInput
          type="number"
          placeholder="Duration(min)"
          className="flex-1"
          {...register("duration", { setValueAs: toNumberOrUndefined })}
        />
      </div>

      <Textarea placeholder="Description" {...register("description")} />

      <div className="flex items-center gap-3">
        <FormInput
          type="number"
          placeholder="Year"
          className="flex-1"
          {...register("year", { setValueAs: toNumberOrUndefined })}
        />
        <FormInput
          type="number"
          step="0.1"
          placeholder="Mark"
          className="flex-1"
          {...register("mark", { setValueAs: toNumberOrUndefined })}
        />
      </div>

      <FormInput placeholder="Link" {...register("link")} error={!!errors.link} />
    </>
  );
}
