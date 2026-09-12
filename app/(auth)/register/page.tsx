"use client";

import Link from "next/link";
import { FieldErrors, useForm } from "react-hook-form";
import { FormInput, Button, LoadingSpinner } from "@/components";
import { registerSchema, RegisterSchema } from "@/lib/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/lib/stores";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/api";
import { useState } from "react";

export default function RegisterPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: { username: "", password: "", confirmPassword: "" },
  });

  const [username, password, confirmPassword] = watch(["username", "password", "confirmPassword"]);
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
      setError("root", { message: "User with the same name is already exist" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onInvalid = (errors: FieldErrors<RegisterSchema>) => {
    const firstError = Object.values(errors)[0];
    setError("root", { message: firstError?.message ?? "Invalid form data" });
  };

  return (
    <>
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
        <FormInput type="text" placeholder="Username" {...register("username")} />

        <FormInput type="password" placeholder="Password" {...register("password")} />

        <FormInput
          type="password"
          placeholder="Confirm password"
          {...register("confirmPassword")}
        />

        {errors.root ? (
          <p className="text-center text-xs text-red-500">{errors.root.message}</p>
        ) : (
          <p className="h-4"></p>
        )}

        <Button type="submit" disabled={!isFilled}>
          SignUp
        </Button>
      </form>

      <p className="mt-4 text-center text-xs text-zinc-500">
        Already have an account?{" "}
        <Link href="/login" className="cursor-pointer underline">
          Login
        </Link>
      </p>

      {isSubmitting && <LoadingSpinner />}
    </>
  );
}
