"use client";

import Link from "next/link";
import { FieldErrors, useForm, useWatch } from "react-hook-form";
import { FormInput, Button, LoadingSpinner } from "@/components";
import { loginSchema, LoginSchema } from "@/lib/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/lib/stores";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/api";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useTranslateError } from "@/hooks/useTranslateError";

export default function LoginPage() {
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
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  const [username, password] = useWatch({ control, name: ["username", "password"] });
  const isFilled = Boolean(username?.trim()) && Boolean(password?.trim());

  const setToken = useAuthStore((state) => state.setToken);
  const router = useRouter();

  const onSubmit = async (data: LoginSchema) => {
    setIsSubmitting(true);
    try {
      const response = await loginUser(data);
      setToken(response.access_token);
      router.push("/");
    } catch {
      setError("root", { message: "auth.incorrectCredentials" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onInvalid = (errors: FieldErrors<LoginSchema>) => {
    const firstError = Object.values(errors)[0];
    setError("root", { message: firstError?.message ?? "auth.invalidFormData" });
  };

  return (
    <>
      <h1 className="sr-only">{t("loginTitle")}</h1>

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

        {errors.root ? (
          <p role="alert" className="text-danger text-center text-xs">
            {translateError(errors.root.message)}
          </p>
        ) : (
          <p className="h-4"></p>
        )}

        <Button type="submit" disabled={!isFilled}>
          {tCommon("login")}
        </Button>
      </form>

      <p className="text-muted-foreground mt-4 text-center text-xs">
        {t("noAccount")}{" "}
        <Link href="/register" className="focus-ring cursor-pointer rounded-sm underline">
          {tCommon("signUp")}
        </Link>
      </p>

      {isSubmitting && <LoadingSpinner />}
    </>
  );
}
