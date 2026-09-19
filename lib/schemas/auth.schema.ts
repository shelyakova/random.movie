import z from "zod";

export const loginSchema = z.object({
  username: z.string().min(3, "validation.usernameMinLength"),
  password: z.string().min(6, "validation.passwordMinLength"),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    username: z.string().min(3, "validation.usernameMinLength"),
    password: z.string().min(6, "validation.passwordMinLength"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "validation.passwordsDoNotMatch",
    path: ["confirmPassword"],
  });

export type RegisterSchema = z.infer<typeof registerSchema>;
