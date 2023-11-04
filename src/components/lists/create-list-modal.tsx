import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { BaseDialogProps, Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CORE_TESTNET_CHAIN_ID, POLYGON_ZKSYNC_TESTNET_CHAIN_ID } from "@/config/chains";
import { cn } from "@/lib/utils";

import { Icons } from "../icons";
import { buttonVariants } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { toast } from "../ui/use-toast";

const createListFieldsSchema = z.object({
  name: z.string().min(1, { message: "Required" }),
  params: z.object({
    tokenAddress: z.string().min(1),
    amount: z.string().min(1).regex(/^\d+$/),
  }),
});

type CreateListData = z.infer<typeof createListFieldsSchema>;

export function CreateListModal({ open, onOpenChange }: BaseDialogProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [listType, setListType] = useState("nft");
  const [chainId, setChainId] = useState(CORE_TESTNET_CHAIN_ID.toString());

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateListData>({
    resolver: zodResolver(createListFieldsSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    console.log("Data: ", data);

    setIsLoading(true);

    const response = await fetch("/api/lists", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: data.name,
        params: {
          ...data.params,
          chainId,
        },
        type: listType,
        contacts: ["0x0F45421E8DC47eF9edd8568a9D569b6fc7Aa7AC6"],
      }),
    });

    setIsLoading(false);

    if (!response?.ok) {
      return toast({
        title: "Something went wrong.",
        description: "Your List was not created. Please try again.",
        variant: "destructive",
      });
    }

    toast({
      title: "List created!.",
      description: "Your List was created successfully",
      variant: "default",
    });

    // This forces a cache invalidation.
    router.refresh();

    onOpenChange?.(false);
  });

  console.log("Errors: ", errors);

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={true}>
      <DialogContent>
        <h3 className="text-xl font-bold">Create List</h3>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div>
            <Label htmlFor="name" className="mb-2 block">
              Name
            </Label>
            <Input
              id="name"
              placeholder="Name"
              type="text"
              autoCapitalize="none"
              autoCorrect="off"
              disabled={isLoading}
              {...register("name")}
            />
            {errors?.name && <p className="px-1 text-xs text-red-600">{errors.name.message}</p>}
          </div>
          <div>
            <Label htmlFor="name" className="mb-2 block">
              Filter
            </Label>
            <Select value={listType} onValueChange={setListType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="nft">NFT</SelectItem>
                  <SelectItem value="token">Token</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="name" className="mb-2 block">
              Chain
            </Label>
            <Select value={chainId} onValueChange={setChainId}>
              <SelectTrigger>
                <SelectValue>
                  {chainId === CORE_TESTNET_CHAIN_ID.toString() ? "Core" : "Polygon zkEVM"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value={CORE_TESTNET_CHAIN_ID.toString()}>Core</SelectItem>
                  <SelectItem value={POLYGON_ZKSYNC_TESTNET_CHAIN_ID.toString()}>
                    Polygon zkEVM
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="tokenAddress" className="mb-2 block">
              Token Address
            </Label>
            <Input
              id="tokenAddress"
              placeholder="Token Address"
              type="text"
              autoCapitalize="none"
              autoCorrect="off"
              disabled={isLoading}
              {...register("params.tokenAddress")}
            />
            {errors?.params?.tokenAddress && (
              <p className="px-1 text-xs text-red-600">{errors.params.tokenAddress.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="amount" className="mb-2 block">
              Amount
            </Label>
            <Input
              id="amount"
              placeholder="Amount"
              type="number"
              autoCapitalize="none"
              autoCorrect="off"
              disabled={isLoading}
              {...register("params.amount")}
            />
            {errors?.params?.amount && (
              <p className="px-1 text-xs text-red-600">{errors.params.amount.message}</p>
            )}
          </div>
          <button
            className={cn(buttonVariants(), {
              "cursor-not-allowed opacity-60": isLoading,
            })}
            disabled={isLoading}
          >
            {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            New List
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
