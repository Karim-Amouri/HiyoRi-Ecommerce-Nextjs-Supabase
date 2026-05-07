"use client";

import { useEffect } from "react";

import { useToast } from "@/components/ui/use-toast";

type ProductDetailErrorProps = {
  message: string;
};

export default function ProductDetailError({
  message,
}: ProductDetailErrorProps) {
  const { toast } = useToast();

  useEffect(() => {
    toast({
      title: "Error",
      description: message,
      variant: "destructive",
    });
  }, [message, toast]);

  return (
    <div className="container flex min-h-[40vh] items-center justify-center">
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
