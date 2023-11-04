"use client";

import { Contact, List } from "@prisma/client";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import { CreateCampaignModal } from "./create-campaign-modal";

interface CreateCampaignButtonProps {
  lists: List[];
  contacts: Contact[];
}

export function CreateCampaignButton({ lists, contacts }: CreateCampaignButtonProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button onClick={() => setShowModal(true)}>New Campaign</Button>
      <CreateCampaignModal
        open={showModal}
        onOpenChange={setShowModal}
        lists={lists}
        contacts={contacts}
      />
    </>
  );
}
