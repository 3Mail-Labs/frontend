import { z } from "zod";

export const createListSchema = z.object({
  name: z.string().min(1, { message: "Required" }),
  contacts: z.array(z.string()).min(1, { message: "Required" }),
});
