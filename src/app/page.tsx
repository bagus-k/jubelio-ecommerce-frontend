"use client";

import { useEffect, useRef, useState } from "react";
import { useProductStore } from "./store/product";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useInView } from "react-intersection-observer";
import ProductImage from "@/components/product-image";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { Toaster } from "@/components/ui/toaster";
import { productSchema } from "./schema/schemas";
import ProductHandlerDialog from "@/components/product-handler-dialog";

export default function Home() {
  const {
    products,
    isLoading,
    getProducts,
    getNextPage,
    hasMorePage,
    addProduct,
  } = useProductStore();
  const loadingRef = useRef(false);
  const pageLoadingRef = useRef(false);

  const [isDialogOpen, setDialogOpen] = useState(false);

  const { toast } = useToast();

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      sku: "",
      description: "",
      image: "",
      price: 0,
      stock: 0,
    },
  });

  useEffect(() => {
    if (!loadingRef.current) {
      loadingRef.current = true;
      getProducts();
    }
  }, [getProducts]);

  useEffect(() => {
    const handleNextPage = async () => {
      if (inView && !isLoading && hasMorePage && !pageLoadingRef.current) {
        pageLoadingRef.current = true;
        getNextPage();

        setTimeout(() => {
          pageLoadingRef.current = false;
        }, 500);
      }
    };

    handleNextPage();
  }, [inView, isLoading, getNextPage, hasMorePage]);

  useEffect(() => {
    return () => {
      loadingRef.current = false;
      pageLoadingRef.current = false;
    };
  }, []);

  const onSubmit = async (values: z.infer<typeof productSchema>) => {
    try {
      await addProduct(values);

      form.reset();
      setDialogOpen(false);
      toast({
        variant: "success",
        title: "Product added successfully!",
        description: "Your product has been successfully added to the list.",
        duration: 5000,
      });
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        console.error("Error adding product:", error);
        toast({
          variant: "failed",
          title:
            error.response.status === 422
              ? error.response.data.message
              : "Failed to add product.",
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

  const onCloseDialog = () => {
    setDialogOpen(!isDialogOpen);
    form.reset();
  };

  return (
    <main className="min-h-screen w-full font-[family-name:var(--font-geist-sans)]">
      <div className="mx-auto max-w-screen-2xl w-full">
        <div className="flex flex-row-reverse pb-4 w-full">
          <ProductHandlerDialog
            isDialogOpen={isDialogOpen}
            onCloseDialog={onCloseDialog}
            form={form}
            onSubmit={onSubmit}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {products?.map((item) => (
            <Card key={item.sku} className="h-full">
              <CardHeader className="items-center text-center">
                <div className="relative w-full h-[200px]">
                  <ProductImage src={item.image} alt={item.title} />
                </div>
              </CardHeader>
              <CardContent className="text-left">
                <CardTitle className="text-lg">{item.title}</CardTitle>
                <CardDescription className="mt-2">
                  ${item.price}
                </CardDescription>
                <CardDescription className="mt-1">
                  Only {item.stock} left in stock
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {isLoading && (
          <div className="text-center my-4 mt-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          </div>
        )}

        {!isLoading && !hasMorePage && (
          <div className="text-center my-8 text-gray-500">
            No more products to load
          </div>
        )}

        {hasMorePage && <div ref={ref} className="h-20" />}
      </div>

      <Toaster />
    </main>
  );
}
