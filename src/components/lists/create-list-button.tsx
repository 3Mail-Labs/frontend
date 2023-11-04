"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

import { CreateListModal } from "./create-list-modal";

export function CreateListButton() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button onClick={() => setShowModal(true)}>New List</Button>
      <CreateListModal open={showModal} onOpenChange={setShowModal} />
    </>
  );
}
