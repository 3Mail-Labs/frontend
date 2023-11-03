import { z } from "zod";

const campaignTypeSchema = z.union([z.literal("email"), z.literal("notification")]);

export const createCampaignSchema = z.object({
  name: z.string().min(1, { message: "Required" }),
  description: z.string().optional(),
  type: campaignTypeSchema,
  subject: z.string().optional(),
  content: z.string().min(1),
  listId: z.string().min(1),
});
