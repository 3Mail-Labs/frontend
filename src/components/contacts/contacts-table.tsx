"use client";

import { Contact } from "@prisma/client";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import * as React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Address } from "../address";

export const columns: ColumnDef<Contact>[] = [
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => <Address address={row.getValue("address")} />,
  },
  {
    accessorKey: "createdAt",
    header: "Created at",
    cell: ({ getValue }) => (
      <div>
        {(getValue() as Date).toLocaleDateString("en-us", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </div>
    ),
  },
  {
    accessorKey: "numberOfAccess",
    header: "Number of emails",
    cell: ({ row }) => <span>{row.getValue("numberOfAccess")}</span>,
  },
  {
    accessorKey: "pricePerEmail",
    header: "Price per email",
    cell: ({ row }) => <span>{row.getValue("pricePerEmail")}</span>,
  },
];

interface ContactsTableProps {
  contacts: Contact[];
}

export function ContactsTable({ contacts }: ContactsTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: contacts,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="rounded-md border">
      <Table className="rounded-md border">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className="pl-4">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="pl-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 pl-4 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
