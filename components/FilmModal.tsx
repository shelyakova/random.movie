import Modal from "./Modal";
import FormInput from "./FormInput";
import Textarea from "./Textarea";
import Button from "./Button";
import MultiSelectDropdown from "./MultiSelectDropdown";
import { filmSchema, FilmSchema } from "@/lib/schemas/film.schema";
import { FieldErrors, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCategories } from "@/hooks/useCategories";
import { useCreateFilm } from "@/hooks";
import LoadingSpinner from "./LoadingSpinner";

interface FilmModalProps {
  onClose?: () => void;
}

export default function FilmModal({ onClose }: FilmModalProps) {
  const { data: categories = [], isLoading: isCategoriesLoading } = useCategories();
  const createFilm = useCreateFilm();

  const isLoading = isCategoriesLoading || createFilm.isPending;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FilmSchema>({
    resolver: zodResolver(filmSchema),
  });

  const [name, categoryIds, link] = watch([
    "name",
    "categoryIds",
    "link",
  ]);

  const isFilled = Boolean(name?.trim()) && Boolean(link?.trim());

  const onSubmit = (data: FilmSchema) => {
    createFilm.mutate(data, {
      onSuccess: () => onClose?.(),
    });
  };

  return (
    <Modal
      title="Add new film"
      onClose={onClose}
      className="max-w-[500px]!"
      footer={
        <Button disabled={!isFilled} type="submit" form="add-film-form">
          Add
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
          <FormInput type="number" placeholder="Mark" className="flex-1" {...register("mark", { setValueAs: (v) => (v === "" ? undefined : Number(v)) })} />
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
