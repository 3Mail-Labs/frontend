"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Contact, List } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAccount } from "wagmi";
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
import { sendEmails } from "@/lib/iexec";
import { cn } from "@/lib/utils";
import { createCampaignSchema } from "@/lib/validations/campaign";

import { Icons } from "../icons";
import { buttonVariants } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { toast } from "../ui/use-toast";

const createCampaignFieldsSchema = createCampaignSchema.pick({
  name: true,
  content: true,
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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCampaignData>({
    resolver: zodResolver(createCampaignFieldsSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    setIsLoading(true);

    // Filter contacts by list
    let filteredContacts: string[] = [];

    if (selectedList === "all-contacts") {
      filteredContacts = contacts.map((contact) => contact.address);
    } else {
      const response = await fetch(`/api/lists/${selectedList}/contacts`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const json = await response.json();
      console.log("Response: ", json);

      filteredContacts = json.map((contact: any) => contact.address);
    }

    // Send emails
    const provider = await connector?.getProvider();
    const sentEmails = await sendEmails({
      provider,
      content: data.content,
      subject: "Subject",
      senderName: "3mail",
      contacts: filteredContacts,
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
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={true}>
      <DialogContent>
        <h3 className="text-xl font-bold">Create Campaign</h3>
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
              {...register("name")}
            />
            {errors?.name && <p className="px-1 text-xs text-red-600">{errors.name.message}</p>}
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
              {...register("content")}
            />
            {errors?.content && (
              <p className="px-1 text-xs text-red-600">{errors.content.message}</p>
            )}
          </div>
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
      </DialogContent>
    </Dialog>
  );
}
