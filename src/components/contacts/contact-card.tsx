import { Contact } from "@prisma/client";

import { Address } from "../address";
import { Skeleton } from "../ui/skeleton";

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

ContactCard.Skeleton = function PostItemSkeleton() {
  return (
    <div className="rounded-lg border border-border p-6 shadow transition-all hover:shadow-lg">
      <div className="flex items-center gap-4">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div>
          <Skeleton className="mb-3 h-5 w-24" />
          <Skeleton className="h-5 w-20" />
        </div>
      </div>
    </div>
  );
};
