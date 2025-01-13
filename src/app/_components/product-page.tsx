import { Button } from "@/components/ui/button";
import React, { useEffect, useRef, useState } from "react";
import { Product, useProductStore } from "../store/product";
import { useToast } from "@/hooks/use-toast";
import { useInView } from "react-intersection-observer";
import { productSchema } from "../schema/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ProductImage from "./product-image";
import ProductHandlerDialog from "./product-handler-dialog";
import ConfirmationDialog from "@/components/confirmation-dialog";
import ProductDetailDialog from "./product-detail-dialog";
import { Toaster } from "@/components/ui/toaster";
import { Input } from "@/components/ui/input";

const ProductPage = ({ activeTab }: { activeTab: string }) => {
  const {
    products,
    isLoading,
    getProducts,
    getNextPage,
    hasMorePage,
    addProduct,
    getDetailProduct,
    product,
    updateProduct,
    deleteProduct,
    keyword,
  } = useProductStore();
  const loadingRef = useRef(false);
  const pageLoadingRef = useRef(false);

  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isDialogDetailOpen, setDialogDetailOpen] = useState(false);
  const [isDialogConfirmationOpen, setDialogConfirmationOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("Add Product");
  const [searchValue, setSearchValue] = useState(keyword);

  const { toast } = useToast();

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      id: 0,
      title: "",
      sku: "",
      description: "",
      image: "",
      price: 0,
      stock: 0,
    },
  });

  useEffect(() => {
    if (!loadingRef.current || activeTab) {
      loadingRef.current = true;
      getProducts({ page: 1, keyword: searchValue });
    }
  }, [getProducts, activeTab, searchValue]);

  useEffect(() => {
    const handleNextPage = async () => {
      if (inView && !isLoading && hasMorePage && !pageLoadingRef.current) {
        pageLoadingRef.current = true;
        getNextPage({ keyword: keyword });
        setTimeout(() => {
          pageLoadingRef.current = false;
        }, 500);
      }
    };
    handleNextPage();
  }, [inView, isLoading, getNextPage, hasMorePage, keyword]);

  useEffect(() => {
    return () => {
      loadingRef.current = false;
      pageLoadingRef.current = false;
    };
  }, []);

  const onSubmit = async (values: z.infer<typeof productSchema>) => {
    try {
      if (dialogTitle === "Add Product") {
        await addProduct(values);

        toast({
          variant: "success",
          title: "Product added successfully!",
          description: "Your product has been successfully added to the list.",
          duration: 5000,
        });
      } else {
        await updateProduct(values);
        await getProducts({ page: 1, keyword: keyword });

        toast({
          variant: "success",
          title: "Product updated successfully!",
          description:
            "Your product has been successfully updated to the list.",
          duration: 5000,
        });
      }

      form.reset();
      setDialogOpen(false);
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

  const onDelete = async (values: z.infer<typeof productSchema>) => {
    try {
      await deleteProduct(values);
      toast({
        variant: "success",
        title: "Product deleted successfully!",
        description:
          "Your product has been successfully deleted from the list.",
        duration: 5000,
      });
      form.reset();
      setDialogDetailOpen(false);
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

  const onCloseDialog = () => {
    setDialogOpen(!isDialogOpen);
    if (isDialogOpen) {
      setDialogTitle("Add Product");
    }
    form.reset();
  };

  const handleCreateProduct = () => {
    setDialogOpen(true);
    setDialogTitle("Add Product");
  };

  const handleDetailProduct = ({ item }: { item: Product }) => {
    getDetailProduct({ id: item.id });
    setDialogDetailOpen(true);
  };

  const handleUpdateProduct = () => {
    setDialogOpen(true);
    if (isDialogDetailOpen) {
      setDialogTitle("Update Product");
    }
  };

  const onCloseDetailDialog = () => {
    setDialogDetailOpen(!isDialogDetailOpen);
    form.reset();
  };

  return (
    <div>
      <div className="flex flex-row justify-between p-4 w-full  gap-2">
        <div>
          <Input
            type="search"
            placeholder="Search by name and sku"
            className="w-25"
            onChange={(e) => setSearchValue(e.target.value)}
            value={searchValue}
          />
        </div>
        <Button variant="default" onClick={handleCreateProduct}>
          Add Product
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        {products?.map((item) => (
          <Card
            key={item.sku}
            className="h-full"
            onClick={() => handleDetailProduct({ item: item })}
          >
            <CardHeader className="items-center text-center">
              <div className="relative w-full h-[200px]">
                <ProductImage src={item.image} alt={item.title} />
              </div>
            </CardHeader>
            <CardContent className="text-left">
              <CardTitle className="text-lg">{item.title}</CardTitle>
              <CardDescription className="mt-2">${item.price}</CardDescription>
              <CardDescription className="mt-1">
                Only {item.stock} left in stock
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      <ProductHandlerDialog
        title={dialogTitle}
        isDialogOpen={isDialogOpen}
        onCloseDialog={onCloseDialog}
        form={form}
        onSubmit={onSubmit}
        product={product}
      />

      <ConfirmationDialog
        isDialogOpen={isDialogConfirmationOpen}
        onCloseDialog={() =>
          setDialogConfirmationOpen(!isDialogConfirmationOpen)
        }
        title="Are you sure you want to delete this item?"
        description="This action cannot be undone."
        onSubmit={() => onDelete(product)}
      />

      <ProductDetailDialog
        isDialogOpen={isDialogDetailOpen}
        onCloseDialog={onCloseDetailDialog}
        onDelete={() => setDialogConfirmationOpen(true)}
        onUpdate={() => handleUpdateProduct()}
        product={product}
      />

      <Toaster />

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
  );
};

export default ProductPage;
