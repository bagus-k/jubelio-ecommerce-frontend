import { z } from "zod";

export const productSchema = z.object({
  id: z.number(),
  title: z.string().min(1, "Product name is required"),
  sku: z.string().min(1, "SKU is required"),
  description: z.string().min(1, "Description is required"),
  image: z.string().url("Image URL must be a valid URL"),
  price: z
    .number()
    .positive("Price must be greater than zero")
    .min(0.01, "Price must be greater than zero"),
});

export const transactionSchema = z.object({
  id: z.number(),
  sku: z.string().min(1, "SKU is required"),
  qty: z.number().int(),
});
