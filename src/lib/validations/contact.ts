import { z } from "zod";

export const createContactSchema = z.object({
  address: z.string().min(1, { message: "Required" }),
  userAddress: z.string().min(1, { message: "Required" }),
  numberOfAccess: z.number().min(1, { message: "Required" }),
  pricePerEmail: z.number(),
});
