import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { z } from "zod";
import { productSchema } from "@/app/schema/schemas";
import { UseFormReturn } from "react-hook-form";

interface ProductHandlerDialogProps {
  isDialogOpen: boolean;
  onCloseDialog: () => void;
  form: UseFormReturn<z.infer<typeof productSchema>>;
  onSubmit: (values: z.infer<typeof productSchema>) => void;
}

const ProductHandlerDialog: React.FC<ProductHandlerDialogProps> = ({
  isDialogOpen,
  onCloseDialog,
  form,
  onSubmit,
}) => {
  return (
    <Dialog open={isDialogOpen} onOpenChange={onCloseDialog}>
      <DialogTrigger asChild>
        <Button variant="default">Add Product</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Product</DialogTitle>
          <DialogDescription>
            Add a new product by filling in the details below.
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
                          type="number"
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value))
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
                          type="number"
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value))
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
