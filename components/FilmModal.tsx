"use client"

import Modal from "./Modal";
import FormInput from "./FormInput";
import Textarea from "./Textarea";
import Button from "./Button";
import MultiSelectDropdown from "./MultiSelectDropdown";
import { filmSchema, FilmSchema } from "@/lib/schemas/film.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCategories } from "@/hooks/useCategories";
import { useCreateFilm } from "@/hooks";
import LoadingSpinner from "./LoadingSpinner";
import { Film } from "@/lib/types";
import { useEditFilm } from "@/hooks/useFilms";

interface FilmModalProps {
  film?: Film;
  onClose?: () => void;
}

export default function FilmModal({ film, onClose }: FilmModalProps) {
  const isEditMode = Boolean(film);

  const { data: categories = [], isLoading: isCategoriesLoading } = useCategories();
  const createFilm = useCreateFilm();
  const editFilm = useEditFilm(film?.id ?? 0);

  const isLoading = isCategoriesLoading || createFilm.isPending || editFilm.isPending;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FilmSchema>({
    resolver: zodResolver(filmSchema),
    defaultValues: film
      ? {
        name: film.name,
        link: film.link,
        categoryIds: film.categories.map((c) => c.id),
        seasons: film.seasons ?? undefined,
        episodes: film.episodes ?? undefined,
        duration: film.duration ?? undefined,
        description: film.description ?? undefined,
        year: film.year ?? undefined,
        mark: film.mark ?? undefined,
      }
      : undefined,
  });

  const [name, categoryIds, link] = watch([
    "name",
    "categoryIds",
    "link",
  ]);

  const isFilled = Boolean(name?.trim()) && Boolean(link?.trim());

  const onSubmit = (data: FilmSchema) => {
    if (isEditMode) {
      editFilm.mutate(data, { onSuccess: () => onClose?.() });
    } else {
      createFilm.mutate(data, { onSuccess: () => onClose?.() });
    }
  };

  return (
    <Modal
      title={isEditMode ? 'Edit film' : 'Add new film'}
      onClose={onClose}
      className="max-w-[500px]!"
      footer={
        <Button disabled={!isFilled} type="submit" form="add-film-form">
          {isEditMode ? 'Edit' : 'Add'}
        </Button>
      }
    >
      <form
        id="add-film-form"
        className="flex flex-col gap-3"
        onSubmit={(event) => {
          if (!isFilled) {
            event.preventDefault();
            return;
          }
          handleSubmit(onSubmit)(event);
        }}
      >
        <FormInput placeholder="Name" {...register("name")} error={!!errors.name} />

        <MultiSelectDropdown
          options={categories}
          selectedIds={categoryIds ?? []}
          onChange={(ids) => setValue("categoryIds", ids, { shouldValidate: true })}
          placeholder="Categories"
          error={!!errors.categoryIds}
        />

        <div className="flex items-center gap-3">
          <FormInput type="number" placeholder="Seasons" className="flex-1" {...register("seasons", { setValueAs: (v) => (v === "" ? undefined : Number(v)) })} />
          <FormInput type="number" placeholder="Episods" className="flex-1" {...register("episodes", { setValueAs: (v) => (v === "" ? undefined : Number(v)) })} />
          <FormInput type="number" placeholder="Duration(min)" className="flex-1" {...register("duration", { setValueAs: (v) => (v === "" ? undefined : Number(v)) })} />
        </div>

        <Textarea placeholder="Description" {...register("description")} />

        <div className="flex items-center gap-3">
          <FormInput type="number" placeholder="Year" className="flex-1" {...register("year", { setValueAs: (v) => (v === "" ? undefined : Number(v)) })} />
          <FormInput type="number" step="0.1" placeholder="Mark" className="flex-1" {...register("mark", { setValueAs: (v) => (v === "" ? undefined : Number(v)) })} />
        </div>

        <FormInput placeholder="Link" {...register("link")} error={!!errors.link} />
      </form>
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-3xl bg-white/60 dark:bg-black/60">
          <LoadingSpinner />
        </div>
      )}
    </Modal>
  );
}
