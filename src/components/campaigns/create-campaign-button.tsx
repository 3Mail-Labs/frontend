"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

import { CreateCampaignModal } from "./create-campaign-modal";

export function CreateCampaignButton() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button onClick={() => setShowModal(true)}>New Campaign</Button>
      <CreateCampaignModal open={showModal} onOpenChange={setShowModal} />
    </>
  );
}
