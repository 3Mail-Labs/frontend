"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { List } from "@prisma/client";
import { ethers } from "ethers";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { polygonZkEvmTestnet } from "viem/chains";
import { useSwitchNetwork } from "wagmi";
import { getNetwork } from "wagmi/actions";
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
import { iexec } from "@/config/chains";
import { createLinks } from "@/lib/peanut";
import { cn } from "@/lib/utils";
import { createCampaignSchema } from "@/lib/validations/campaign";

import { Icons } from "../icons";
import { buttonVariants } from "../ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Textarea } from "../ui/textarea";
import { toast } from "../ui/use-toast";

const createCampaignFieldsSchema = createCampaignSchema
  .pick({
    name: true,
    content: true,
  })
  .extend({
    isRewardCampaign: z.boolean().default(false).optional(),
    rewardAmount: z.string().optional(),
  });

type CreateCampaignData = z.infer<typeof createCampaignFieldsSchema>;

interface CreateCampaignModalProps extends BaseDialogProps {
  contacts: string[];
  lists: List[];
}

export function CreateNotificationCampaignModal({
  contacts,
  open,
  lists,
  onOpenChange,
}: CreateCampaignModalProps) {
  const [selectedList, setSelectedList] = useState("all-contacts");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const { switchNetworkAsync } = useSwitchNetwork();

  const form = useForm<CreateCampaignData>({
    resolver: zodResolver(createCampaignFieldsSchema),
  });

  const onSubmit = form.handleSubmit(async (data) => {
    setIsLoading(true);

    try {
      // Filter contacts by list
      let filteredContacts: string[] = [];

      if (selectedList === "all-contacts") {
        filteredContacts = contacts;
      } else {
        const response = await fetch(`/api/lists/${selectedList}/filter`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contacts,
          }),
        });
        const json = await response.json();
        console.log("Response: ", json);
        filteredContacts = json;
      }

      let url: string | undefined = undefined;

      if (data.isRewardCampaign) {
        // Generate payment links

        const { chain } = getNetwork();
        if (chain?.id !== polygonZkEvmTestnet.id && switchNetworkAsync) {
          await switchNetworkAsync(polygonZkEvmTestnet.id);
        }

        // @ts-ignore
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = web3Provider.getSigner();

        const links = await createLinks({
          chainId: polygonZkEvmTestnet.id,
          signer,
          numberOfLinks: 1,
          amount: Number(data.rewardAmount) || 0,
        });

        url = links[0];
      }

      const { chain } = getNetwork();
      if (chain?.id !== iexec.id && switchNetworkAsync) {
        await switchNetworkAsync(iexec.id);
      }

      // Send emails
      const res = await fetch("/api/notify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accounts: filteredContacts.map((c) => "eip155:1:" + c), // accounts that we want to send the notification to.
          notification: {
            title: "New Notification",
            body: data.content,
            icon: "",
            url,
            type: "ac8a819e-1ad2-4fef-bdcf-80f192be2003",
          },
        }),
      });

      if (res.ok) {
        console.log("Response: ", res);
        const json = await res.json();
        console.log("Response: ", json);

        // const taskIds = sentEmails.map((email) => email.taskId);

        const response = await fetch("/api/campaigns", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...data,
            listId: selectedList === "all-contacts" ? undefined : selectedList,
            type: "notification",
            contacts: filteredContacts,
          }),
        });

        if (!response?.ok) {
          return toast({
            title: "Something went wrong.",
            description: "Your campaign was not created. Please try again.",
            variant: "destructive",
          });
        }

        toast({
          title: "Campaign created!.",
          description: "Your campaign was created successfully",
          variant: "default",
        });
      }

      setIsLoading(false);

      // This forces a cache invalidation.
      router.refresh();

      onOpenChange?.(false);
    } catch (error) {
      setIsLoading(false);
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={true}>
      <DialogContent>
        <h3 className="text-xl font-bold">Create Notification Campaign</h3>
        <Form {...form}>
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <div>
              <Label htmlFor="name" className="mb-2 block">
                Name
              </Label>
              <Input
                id="name"
                placeholder="My Campaign"
                type="text"
                autoCapitalize="none"
                autoCorrect="off"
                // disabled={isLoading || isGitHubLoading}
                {...form.register("name")}
              />
              {form.formState.errors?.name && (
                <p className="px-1 text-xs text-red-600">{form.formState.errors.name.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="name" className="mb-2 block">
                List
              </Label>
              <Select value={selectedList} onValueChange={setSelectedList}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a fruit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all-contacts">All contacts</SelectItem>
                    {lists.map((list) => (
                      <SelectItem key={list.id} value={list.id}>
                        {list.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="content" className="mb-2 block">
                Content
              </Label>
              <Textarea
                id="content"
                placeholder="Your email"
                autoCapitalize="none"
                autoCorrect="off"
                rows={4}
                // disabled={isLoading || isGitHubLoading}
                {...form.register("content")}
              />
              {form.formState.errors?.content && (
                <p className="px-1 text-xs text-red-600">{form.formState.errors.content.message}</p>
              )}
            </div>
            <FormField
              control={form.control}
              name="isRewardCampaign"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Reward Campaign</FormLabel>
                    <FormDescription>Reward your users with tokens.</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            {form.watch("isRewardCampaign") && (
              <div>
                <Label htmlFor="rewardAmount" className="mb-2 block">
                  Reward Amount
                </Label>
                <Input
                  id="rewardAmount"
                  type="number"
                  autoCapitalize="none"
                  autoCorrect="off"
                  step={0.0001}
                  // disabled={isLoading || isGitHubLoading}
                  {...form.register("rewardAmount")}
                />
                {form.formState.errors?.rewardAmount && (
                  <p className="px-1 text-xs text-red-600">
                    {form.formState.errors.rewardAmount.message}
                  </p>
                )}
              </div>
            )}
            <button
              className={cn(buttonVariants(), {
                "cursor-not-allowed opacity-60": isLoading,
              })}
              disabled={isLoading}
            >
              {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
              Send
            </button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
