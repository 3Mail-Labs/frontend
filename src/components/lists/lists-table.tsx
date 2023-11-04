"use client";

import { List } from "@prisma/client";
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
import { CORE_TESTNET_CHAIN_ID } from "@/config/chains";

export const columns: ColumnDef<List>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <span>{row.getValue("name")}</span>,
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => <span>{row.getValue("type") === "nft" ? "NFT" : "Token"}</span>,
  },
  {
    accessorFn: (row) => {
      // Check if params is an object and not an array
      if (typeof row.params === "object" && !Array.isArray(row.params)) {
        return row.params?.tokenAddress;
      }
    },
    header: "Token Address",
    cell: ({ getValue }) => <span>{getValue() as string}</span>,
  },
  {
    accessorFn: (row) => {
      // Check if params is an object and not an array
      if (typeof row.params === "object" && !Array.isArray(row.params)) {
        return row.params?.amount;
      }
    },
    header: "Amount",
    cell: ({ getValue }) => <span>{getValue() as string}</span>,
  },
  {
    accessorFn: (row) => {
      // Check if params is an object and not an array
      if (typeof row.params === "object" && !Array.isArray(row.params)) {
        return row.params?.chainId;
      }
    },
    header: "Chain",
    cell: ({ getValue }) => (
      <span>{getValue() === CORE_TESTNET_CHAIN_ID.toString() ? "Core" : "Polygon zkEVM"}</span>
    ),
  },
];

interface ListsTableProps {
  lists: List[];
}

export function ListsTable({ lists }: ListsTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: lists,
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
