import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

interface ConfirmationDialogProps {
  isDialogOpen: boolean;
  onCloseDialog: () => void;
  onSubmit: () => void;
  title: string;
  description: string;
}

const ConfirmationDialog = ({
  isDialogOpen,
  onCloseDialog,
  title,
  onSubmit,
  description,
}: ConfirmationDialogProps) => {
  return (
    <AlertDialog open={isDialogOpen} onOpenChange={onCloseDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onSubmit}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmationDialog;
