"use client";

import Link from "next/link";
import { FieldErrors, useForm, useWatch } from "react-hook-form";
import { FormInput, Button, LoadingSpinner } from "@/components";
import { registerSchema, RegisterSchema } from "@/lib/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/lib/stores";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/api";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useTranslateError } from "@/hooks/useTranslateError";

export default function RegisterPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const t = useTranslations("auth");
  const tCommon = useTranslations("common");
  const translateError = useTranslateError();

  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: { username: "", password: "", confirmPassword: "" },
  });

  const [username, password, confirmPassword] = useWatch({
    control,
    name: ["username", "password", "confirmPassword"],
  });
  const isFilled =
    Boolean(username?.trim()) && Boolean(password?.trim()) && Boolean(confirmPassword?.trim());

  const setToken = useAuthStore((state) => state.setToken);
  const router = useRouter();

  const onSubmit = async (data: RegisterSchema) => {
    setIsSubmitting(true);
    try {
      const response = await registerUser(data);
      setToken(response.access_token);
      router.push("/");
    } catch {
      setError("root", { message: "auth.usernameTaken" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onInvalid = (errors: FieldErrors<RegisterSchema>) => {
    const firstError = Object.values(errors)[0];
    setError("root", { message: firstError?.message ?? "auth.invalidFormData" });
  };

  return (
    <>
      <h1 className="sr-only">{t("signUpTitle")}</h1>

      <form
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          if (!isFilled) {
            event.preventDefault();
            return;
          }
          handleSubmit(onSubmit, onInvalid)(event);
        }}
      >
        <FormInput
          label={t("username")}
          type="text"
          placeholder={t("username")}
          {...register("username")}
        />

        <FormInput
          label={t("password")}
          type="password"
          placeholder={t("password")}
          {...register("password")}
        />

        <FormInput
          label={t("confirmPassword")}
          type="password"
          placeholder={t("confirmPassword")}
          {...register("confirmPassword")}
        />

        {errors.root ? (
          <p role="alert" className="text-danger text-center text-xs">
            {translateError(errors.root.message)}
          </p>
        ) : (
          <p className="h-4"></p>
        )}

        <Button type="submit" disabled={!isFilled}>
          {tCommon("signUp")}
        </Button>
      </form>

      <p className="text-muted-foreground mt-4 text-center text-xs">
        {t("haveAccount")}{" "}
        <Link href="/login" className="focus-ring cursor-pointer rounded-sm underline">
          {tCommon("login")}
        </Link>
      </p>

      {isSubmitting && <LoadingSpinner />}
    </>
  );
}
