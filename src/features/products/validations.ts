import { products } from "@/lib/supabase/schema";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const productInsertSchema = createInsertSchema(products).extend({
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required.")
    .refine((value) => !/\s/.test(value), {
      message: "Slug cannot contain spaces.",
    }),
});
