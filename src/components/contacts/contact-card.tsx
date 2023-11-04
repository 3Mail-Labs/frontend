import { Contact } from "@prisma/client";

import { Address } from "../address";

interface ContactCardProps {
  contact: Contact;
}

export function ContactCard({ contact }: ContactCardProps) {
  return (
    <div>
      <Address address={contact.address as `0x${string}`} />
    </div>
  );
}
