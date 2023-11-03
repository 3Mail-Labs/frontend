import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { BaseDialogProps, Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { createContactSchema } from "@/lib/validations/contact";

import { Icons } from "../icons";
import { buttonVariants } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { toast } from "../ui/use-toast";

type CreateContactData = z.infer<typeof createContactSchema>;

export function CreateContactModal({ open, onOpenChange }: BaseDialogProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateContactData>({
    resolver: zodResolver(createContactSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    setIsLoading(true);

    const response = await fetch("/api/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    setIsLoading(false);

    if (!response?.ok) {
      return toast({
        title: "Something went wrong.",
        description: "Your contact was not created. Please try again.",
        variant: "destructive",
      });
    }

    toast({
      title: "Contact created!.",
      description: "Your contact was created successfully",
      variant: "default",
    });

    // This forces a cache invalidation.
    router.refresh();

    onOpenChange?.(false);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={true}>
      <DialogContent>
        <h3 className="text-xl font-bold">Create Contact</h3>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div>
            <Label htmlFor="address" className="mb-2 block">
              Name
            </Label>
            <Input
              id="address"
              placeholder="Address"
              type="text"
              autoCapitalize="none"
              autoCorrect="off"
              disabled={isLoading}
              {...register("address")}
            />
            {errors?.address && (
              <p className="px-1 text-xs text-red-600">{errors.address.message}</p>
            )}
          </div>
          <button
            className={cn(buttonVariants(), {
              "cursor-not-allowed opacity-60": isLoading,
            })}
            disabled={isLoading}
          >
            {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            New contact
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
