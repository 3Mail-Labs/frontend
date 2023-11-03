import { z } from "zod";

export const createContactSchema = z.object({
  address: z.string().min(1, { message: "Required" }),
});
