import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Product } from "@/app/store/product";
import ProductImage from "./product-image";

interface ProductDetailDialogProps {
  isDialogOpen: boolean;
  onCloseDialog: () => void;
  onUpdate: () => void;
  onDelete: () => void;
  product?: Product;
}

const ProductDetailDialog = ({
  isDialogOpen,
  onCloseDialog,
  onUpdate,
  onDelete,
  product,
}: ProductDetailDialogProps) => {
  return (
    <Dialog open={isDialogOpen} onOpenChange={onCloseDialog}>
      <DialogContent className="sm:max-w-[375px]">
        <DialogHeader>
          <ProductImage src={product?.image || ""} alt={product?.title || ""} />
          <DialogTitle>{product?.title}</DialogTitle>
          <DialogDescription>{product?.description}</DialogDescription>
        </DialogHeader>

        <DialogDescription>SKU: {product?.sku}</DialogDescription>
        <DialogDescription className="mt-[-15px]">
          Price: {product?.price}
        </DialogDescription>
        <DialogDescription className="mt-[-15px]">
          Stock: {product?.stock}
        </DialogDescription>
        <DialogFooter>
          <div className="grid grid-cols-2 gap-4">
            <Button variant="secondary" onClick={() => onUpdate()}>
              Update
            </Button>
            <Button variant="destructive" onClick={() => onDelete()}>
              Delete
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailDialog;
