"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Contact, List } from "@prisma/client";
import { ethers } from "ethers";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { polygonMumbai } from "viem/chains";
import { useAccount, useSwitchNetwork } from "wagmi";
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
import { Email, sendEmails } from "@/lib/iexec";
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
  lists: List[];
  contacts: Contact[];
}

export function CreateCampaignModal({
  lists,
  contacts,
  open,
  onOpenChange,
}: CreateCampaignModalProps) {
  const [selectedList, setSelectedList] = useState("all-contacts");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const { connector } = useAccount();
  const { switchNetworkAsync } = useSwitchNetwork();

  const form = useForm<CreateCampaignData>({
    resolver: zodResolver(createCampaignFieldsSchema),
  });

  const onSubmit = form.handleSubmit(async (data) => {
    setIsLoading(true);

    try {
      // Filter contacts by list
      let filteredContacts: Contact[] = [];

      if (selectedList === "all-contacts") {
        filteredContacts = contacts;
      } else {
        const response = await fetch(`/api/lists/${selectedList}/contacts`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const json = await response.json();
        console.log("Response: ", json);

        filteredContacts = json;
      }

      console.log("Filtered contacts: ", filteredContacts);

      // Skip paid contacts
      const finalContacts = filteredContacts.filter((contact) => contact.pricePerEmail === 0);

      console.log("Final contacts: ", finalContacts);

      const emails: Email[] = finalContacts.map((contact) => {
        return {
          address: contact.address,
          content: data.content,
          subject: "Subject",
        };
      });

      if (data.isRewardCampaign) {
        // Generate payment links

        const { chain } = getNetwork();
        if (chain?.id !== polygonMumbai.id && switchNetworkAsync) {
          await switchNetworkAsync(polygonMumbai.id);
        }

        // @ts-ignore
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = web3Provider.getSigner();

        const links = await createLinks({
          chainId: polygonMumbai.id,
          signer,
          numberOfLinks: finalContacts.length,
          amount: Number(data.rewardAmount) || 0,
        });

        console.log("Links: ", links);

        // Append payment links to emails
        emails.forEach((email, index) => {
          email.content += `<br/><br/> You received a reward! Claim it at: ${links[index]}`;
        });
      }

      const { chain } = getNetwork();
      if (chain?.id !== iexec.id && switchNetworkAsync) {
        await switchNetworkAsync(iexec.id);
      }

      // Send emails
      const provider = await connector?.getProvider();
      const sentEmails = await sendEmails({
        provider,
        emails,
        senderName: "3mail",
        // content: data.content,
        // subject: "Subject",
        // contacts: freeContacts.map((contact) => contact.address),
      });

      if (sentEmails.length !== 0) {
        console.log("Sent emails: ", sentEmails);

        const response = await fetch("/api/campaigns", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...data,
            listId: selectedList === "all-contacts" ? undefined : selectedList,
            type: "email",
            contacts: finalContacts.map((contact) => contact.address),
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
        <h3 className="text-xl font-bold">Create Campaign</h3>
        <Form {...form}>
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <div>
              <Label htmlFor="name" className="mb-2 block">
                Name
              </Label>
              <Input
                id="name"
                placeholder="My project"
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
                    <FormDescription>Receive emails about your account security.</FormDescription>
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
