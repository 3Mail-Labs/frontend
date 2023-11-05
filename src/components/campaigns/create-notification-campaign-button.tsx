"use client";

import { List } from "@prisma/client";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import { CreateNotificationCampaignModal } from "./create-notification-campaign-modal";

interface CreateCampaignButtonProps {
  contacts: string[];
  lists: List[];
}

export function CreateNotificationCampaignButton({ contacts, lists }: CreateCampaignButtonProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button onClick={() => setShowModal(true)}>New Notification Campaign</Button>
      <CreateNotificationCampaignModal
        open={showModal}
        onOpenChange={setShowModal}
        contacts={contacts}
        lists={lists}
      />
    </>
  );
}
