import { z } from "zod";

export const productSchema = z.object({
  title: z.string().min(1, "Product name is required"),
  sku: z.string().min(1, "SKU is required"),
  description: z.string(),
  image: z.string().url("Image URL must be a valid URL"),
  price: z
    .number()
    .positive("Price must be a positive number")
    .min(0.01, "Price must be greater than zero"),
  stock: z.number().int().nonnegative("Stock must be a non-negative integer"),
});
