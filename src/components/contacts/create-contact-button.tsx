"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

import { CreateContactModal } from "./create-contact-modal";

export function CreateContactButton() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button onClick={() => setShowModal(true)}>New Contact</Button>
      <CreateContactModal open={showModal} onOpenChange={setShowModal} />
    </>
  );
}
