import { z } from "zod";

export const createListSchema = z.object({
  name: z.string().min(1, { message: "Required" }),
  contacts: z.array(z.string()).min(1, { message: "Required" }),
  type: z.union([z.literal("nft"), z.literal("token")]),
  params: z.object({
    chainId: z.string().min(1).regex(/^\d+$/),
    tokenAddress: z.string().min(1),
    amount: z.string().min(1).regex(/^\d+$/),
  }),
});
