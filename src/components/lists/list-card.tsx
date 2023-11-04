import { List } from "@prisma/client";

interface ListCardProps {
  list: List;
}

export function ListCard({ list }: ListCardProps) {
  return <div>{list.name}</div>;
}
