import { UseFormReturn } from "react-hook-form";
import { transactionSchema } from "../schema/schemas";
import { z } from "zod";
import { Transaction } from "../store/transactions";
import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useProductStore } from "../store/product";
import Dropdown, { DropdownDataProps } from "@/components/dropdown";

interface TransactionHandlerProps {
  isDialogOpen: boolean;
  onCloseDialog: () => void;
  form: UseFormReturn<z.infer<typeof transactionSchema>>;
  onSubmit: (values: z.infer<typeof transactionSchema>) => void;
  transaction?: Transaction;
  title: string;
}

const TransactionHandler = ({
  isDialogOpen,
  onCloseDialog,
  form,
  onSubmit,
  transaction,
  title = "Add Transaction",
}: TransactionHandlerProps) => {
  const { products, getProducts, getNextPage } = useProductStore();
  const productData: DropdownDataProps[] = products.map((product) => ({
    value: product.sku,
    label: `${product.sku} - ${product.title}`,
  }));

  useEffect(() => {
    if (transaction?.id !== 0) {
      form.setValue("id", transaction?.id || 0);
      form.setValue("sku", transaction?.sku || "");
      form.setValue("qty", Number(transaction?.qty) || 0);
    }
  }, [transaction, form]);

  const handleInputQty = ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (formattedValue: number | string) => void;
  }) => {
    value = value.replace(/[^0-9-]/g, "");

    if (value.indexOf("-") !== value.lastIndexOf("-")) {
      value = value.replace(/-/g, "");
      value = "-" + value;
    }

    let parsedValue: number | string = Number(value) ? parseInt(value) : value;

    if (!value.startsWith("-")) {
      parsedValue = value ? parseInt(value) : 0;
    }

    if (value.startsWith("0")) {
      parsedValue = parseInt(value);
    }

    onChange(parsedValue);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={onCloseDialog}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {title === "Add Transaction"
              ? "Add a new transaction by filling in the details below."
              : "Update transaction by filling in the details below."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <div className="grid gap-2">
              <FormField
                name="sku"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="sku" className="text-right">
                      Select SKU
                    </Label>
                    <div className="col-span-3">
                      <FormControl>
                        <Dropdown
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          options={productData}
                          fetchData={getProducts}
                          getNextPage={getNextPage}
                          placeholder="Select Product"
                        />
                      </FormControl>
                      <FormMessage className="text-right" />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                name="qty"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="qty" className="text-right">
                      Qty
                    </Label>
                    <div className="col-span-3">
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Transaction Qty"
                          type="text"
                          onChange={(e) =>
                            handleInputQty({
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

export default TransactionHandler;
