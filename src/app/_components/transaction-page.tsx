import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React, { useEffect, useState } from "react";
import { Transaction, useTransactionStore } from "../store/transactions";
import { Button } from "@/components/ui/button";
import TransactionHandler from "./transaction-handler-dialog";
import { useForm } from "react-hook-form";
import { transactionSchema } from "../schema/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { Toaster } from "@/components/ui/toaster";
import ConfirmationDialog from "@/components/confirmation-dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const TransactionPage = ({ activeTab }: { activeTab: string }) => {
  const {
    getTransactions,
    transactions,
    addTransaction,
    updateTransaction,
    getDetailTransaction,
    transaction,
    deleteTransaction,
    currentPage,
    totalPage,
  } = useTransactionStore();
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isDialogConfirmationOpen, setDialogConfirmationOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("Add Transaction");
  const [searchValue, setSearchValue] = useState("");

  const { toast } = useToast();

  const form = useForm<z.infer<typeof transactionSchema>>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      id: 0,
      sku: "",
      qty: 0,
    },
  });

  useEffect(() => {
    if (activeTab) {
      getTransactions({ page: 1, keyword: searchValue });
    }
  }, [getTransactions, activeTab, searchValue]);

  const onSubmit = async (values: z.infer<typeof transactionSchema>) => {
    try {
      if (dialogTitle === "Add Transaction") {
        await addTransaction(values);

        toast({
          variant: "success",
          title: "Transaction added successfully!",
          description:
            "Your transaction has been successfully added to the list.",
          duration: 5000,
        });
      } else {
        await updateTransaction(values);
        await getTransactions({ page: 1, keyword: "" });

        toast({
          variant: "success",
          title: "Transaction updated successfully!",
          description:
            "Your transaction has been successfully updated to the list.",
          duration: 5000,
        });
      }

      form.reset();
      setDialogOpen(false);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        console.error("Error adding transaction:", error);
        toast({
          variant: "failed",
          title:
            error.response.status === 422
              ? error.response.data.message
              : "Failed to transaction product.",
          description: "There was a problem with your request.",
          duration: 5000,
        });
      } else {
        console.error("Unexpected error:", error);
        toast({
          variant: "failed",
          title: "An unexpected error occurred.",
          description: "Please try again later.",
          duration: 5000,
        });
      }
    }
  };

  const handleCreate = () => {
    setDialogTitle("Add Transaction");
    setDialogOpen(true);
  };

  const handleUpdate = ({ item }: { item: Transaction }) => {
    getDetailTransaction({ id: item.id });
    setDialogTitle("Update Transaction");
    setDialogOpen(true);
  };

  const handleDelete = ({ item }: { item: Transaction }) => {
    getDetailTransaction({ id: item.id });
    setDialogConfirmationOpen(true);
  };

  const onCloseDialog = () => {
    setDialogOpen(!isDialogOpen);
    if (isDialogOpen) {
      setDialogTitle("Add Transaction");
    }
    form.reset();
  };

  const onDelete = async (values: z.infer<typeof transactionSchema>) => {
    try {
      await deleteTransaction(values);
      toast({
        variant: "success",
        title: "Transaction deleted successfully!",
        description:
          "Your transaction has been successfully deleted from the list.",
        duration: 5000,
      });
      form.reset();
      setDialogConfirmationOpen(false);
    } catch (error: unknown) {
      console.error("Unexpected error:", error);
      toast({
        variant: "failed",
        title: "An unexpected error occurred.",
        description: "Please try again later.",
        duration: 5000,
      });
    }
  };

  return (
    <div className="bg-white">
      <div className="flex flex-row justify-between p-4 w-full gap-2">
        <div>
          <Input
            type="search"
            placeholder="Search by name and sku"
            className="w-25"
            onChange={(e) => setSearchValue(e.target.value)}
            value={searchValue}
          />
        </div>
        <Button variant="default" onClick={handleCreate}>
          Add Transaction
        </Button>
      </div>
      <Table>
        <TableCaption>A list of your recent transactions.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>SKU</TableHead>
            <TableHead>Qty</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead className="text-right pr-16">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((item) => {
            const amount =
              item.amount < 0
                ? `-$${item.amount.toString().slice(1)}`
                : `$${item.amount}`;
            return (
              <TableRow
                key={item.id}
                className={cn(
                  "",
                  item.amount < 0
                    ? "bg-red-300 hover:bg-red-400"
                    : item.amount > 0
                    ? "bg-green-300 hover:bg-green-400"
                    : "bg-white hover:bg-slate-200"
                )}
              >
                <TableCell className="font-medium">{item.sku}</TableCell>
                <TableCell>{item.qty}</TableCell>
                <TableCell>{amount}</TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-row-reverse gap-4">
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete({ item: item })}
                    >
                      Delete
                    </Button>
                    <Button
                      variant={"secondary"}
                      onClick={() => handleUpdate({ item: item })}
                    >
                      Update
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4}>
              <div className="flex justify-end items-center gap-3">
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() =>
                    getTransactions({
                      page: currentPage - 1,
                      keyword: searchValue,
                    })
                  }
                >
                  Previous
                </Button>
                <span>
                  Page {currentPage} of {totalPage}
                </span>
                <Button
                  variant="outline"
                  disabled={currentPage === totalPage}
                  onClick={() =>
                    getTransactions({
                      page: currentPage + 1,
                      keyword: searchValue,
                    })
                  }
                >
                  Next
                </Button>
              </div>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      <TransactionHandler
        title={dialogTitle}
        isDialogOpen={isDialogOpen}
        onCloseDialog={onCloseDialog}
        form={form}
        onSubmit={onSubmit}
        transaction={transaction}
      />

      <ConfirmationDialog
        isDialogOpen={isDialogConfirmationOpen}
        onCloseDialog={() =>
          setDialogConfirmationOpen(!isDialogConfirmationOpen)
        }
        title="Are you sure you want to delete this item?"
        description="This action cannot be undone."
        onSubmit={() => onDelete(transaction)}
      />

      <Toaster />
    </div>
  );
};

export default TransactionPage;
