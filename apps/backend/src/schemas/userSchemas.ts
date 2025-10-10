import { z } from "zod";

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(3),
    email: z.email(),
    password: z.string().min(6),
  }),
});

export const authenticateUserSchema = z.object({
  body: z.object({
    email: z.email(),
    password: z.string().min(6),
  }),
});
