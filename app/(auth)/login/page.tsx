"use client";

import Link from "next/link";
import { FieldErrors, useForm } from "react-hook-form";
import FormInput from "@/components/FormInput";
import Button from "@/components/Button";
import { loginSchema, LoginSchema } from "@/lib/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/lib/stores/auth.store";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/api-client";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  const [username, password] = watch(["username", "password"]);
  const isFilled = Boolean(username?.trim()) && Boolean(password?.trim());

  const setToken = useAuthStore((state) => state.setToken);
  const router = useRouter();

  const onSubmit = async (data: LoginSchema) => {
    try {
      const response = await loginUser(data);
      setToken(response.access_token);
      router.push('/');
    } catch {
      setError("root", { message: "Incorrect username or password" });
    }
  };

  const onInvalid = (errors: FieldErrors<LoginSchema>) => {
    const firstError = Object.values(errors)[0];
    setError('root', { message: firstError?.message ?? 'Invalid form data' });
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
        <FormInput
          type="text"
          placeholder="Username"
          {...register("username")}
        />

        <FormInput
          type="password"
          placeholder="Password"
          {...register("password")}
        />

        {errors.root ? (
          <p className="text-center text-xs text-red-500">{errors.root.message}</p>
        ) : (
          <p className="h-4"></p>
        )}

        <Button type="submit" disabled={!isFilled}>
          Login
        </Button>
      </form>

      <p className="mt-4 text-center text-xs text-zinc-500">
        You don&apos;t have an account?{" "}
        <Link href="/register" className="cursor-pointer underline">
          SignUp
        </Link>
      </p>
    </>
  );
}
