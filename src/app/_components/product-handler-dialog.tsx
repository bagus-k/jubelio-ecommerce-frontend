import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../../components/ui/form";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";
import { z } from "zod";
import { productSchema } from "@/app/schema/schemas";
import { UseFormReturn } from "react-hook-form";
import { Product } from "@/app/store/product";

interface ProductHandlerDialogProps {
  isDialogOpen: boolean;
  onCloseDialog: () => void;
  form: UseFormReturn<z.infer<typeof productSchema>>;
  onSubmit: (values: z.infer<typeof productSchema>) => void;
  product?: Product;
  title: string;
}

const ProductHandlerDialog = ({
  isDialogOpen,
  onCloseDialog,
  form,
  onSubmit,
  product,
  title = "Add Product",
}: ProductHandlerDialogProps) => {
  useEffect(() => {
    if (product?.id !== 0) {
      form.setValue("id", product?.id || 0);
      form.setValue("title", product?.title || "");
      form.setValue("sku", product?.sku || "");
      form.setValue("description", product?.description || "");
      form.setValue("image", product?.image || "");
      form.setValue("price", Number(product?.price) || 0);
      form.setValue("stock", Number(product?.stock) || 0);
    }
  }, [product, form]);

  const handleInputPrice = ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (formattedValue: number | string) => void;
  }) => {
    value = value.replace(/[^0-9.]/g, "");

    const dotCount = (value.match(/\./g) || []).length;
    if (dotCount > 1) {
      value = value.slice(0, value.lastIndexOf("."));
    }

    const decimalMatch = value.match(/^(\d*\.?\d{0,2})/);
    value = decimalMatch ? decimalMatch[1] : value;

    if (value.startsWith("0") && !value.startsWith("0.")) {
      value = parseFloat(value).toString();
    }

    let parsedValue: number | string = value;

    if (!value.endsWith(".")) {
      parsedValue = value ? parseFloat(value) : 0;
    }
    onChange(parsedValue);
  };

  const handleInputStock = ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (formattedValue: number) => void;
  }) => {
    value = value.replace(/[^0-9]/g, "");

    onChange(value ? parseInt(value) : 0);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={onCloseDialog}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {title === "Add Product"
              ? "Add a new product by filling in the details below."
              : "Update product by filling in the details below."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <div className="grid gap-2">
              <FormField
                name="title"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">
                      Name
                    </Label>
                    <div className="col-span-3">
                      <FormControl>
                        <Input {...field} placeholder="Product Name" />
                      </FormControl>
                      <FormMessage className="text-right p-0 m-0" />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                name="sku"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="sku" className="text-right">
                      SKU
                    </Label>
                    <div className="col-span-3">
                      <FormControl>
                        <Input {...field} placeholder="Product SKU" />
                      </FormControl>
                      <FormMessage className="text-right" />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                name="description"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      Description
                    </Label>
                    <div className="col-span-3">
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Product Description"
                        />
                      </FormControl>
                      <FormMessage className="text-right" />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                name="image"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="image" className="text-right">
                      Image URL
                    </Label>
                    <div className="col-span-3">
                      <FormControl>
                        <Textarea {...field} placeholder="Product Image URL" />
                      </FormControl>
                      <FormMessage className="text-right" />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                name="price"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="price" className="text-right">
                      Price
                    </Label>
                    <div className="col-span-3">
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Product Price"
                          type="text"
                          onChange={(e) =>
                            handleInputPrice({
                              value: e.target.value,
                              onChange: field.onChange,
                            })
                          }
                        />
                      </FormControl>
                      <FormMessage className="text-right" />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                name="stock"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="stock" className="text-right">
                      Stock
                    </Label>
                    <div className="col-span-3">
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Product Stock"
                          type="text"
                          onChange={(e) =>
                            handleInputStock({
                              value: e.target.value,
                              onChange: field.onChange,
                            })
                          }
                        />
                      </FormControl>
                      <FormMessage className="text-right" />
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit">Submit</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductHandlerDialog;
