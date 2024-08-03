"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";

type ToastDestructiveProps = {
  open: boolean;
  error?: boolean;
  message?: string | null;
};

export function Toast({ open, error, message }: ToastDestructiveProps) {
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      toast({
        variant: error ? "destructive" : "success",
        title: error ? "Uh oh! Something went wrong." : "Success!",
        description:
          message ||
          (error
            ? "There was a problem with your request."
            : "Your request was successful."),
      });
    }
  }, [open, error, message, toast]);

  return (
    <Button
      variant="outline"
      onClick={() => {
        toast({
          variant: error ? "destructive" : "success",
          title: error ? "Uh oh! Something went wrong." : "Success!",
          description:
            message ||
            (error
              ? "There was a problem with your request."
              : "Your request was successful."),
        });
      }}
    >
      Show Toast
    </Button>
  );
}
