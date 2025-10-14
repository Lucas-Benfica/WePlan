import { z } from "zod";

export const createFamilySchema = z.object({
  body: z.object({
    name: z.string().min(3, "Family name must be at least 3 characters long."),
  }),
});
