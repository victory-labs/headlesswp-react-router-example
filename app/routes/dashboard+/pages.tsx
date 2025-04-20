import { Link, useLoaderData } from "react-router";
import type { Route } from "./+types/posts";
import { DataTable } from "~/components/data-table";
import { type ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "~/components/ui/checkbox";
import { Button } from "~/components/ui/button";
import { ArrowUpDown, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

export const meta: Route.MetaFunction = () => {
  return [{ title: "HeadlessWP - React Router Example" }];
};

export async function loader({}: Route.LoaderArgs) {
  const response = await fetch(
    `${process.env.WORDPRESS_API_URL}/wp-json/wp/v2/pages?_embed`
  );
  const pages = await response.json();
  return { pages };
}

interface WPPage {
  id: number;
  slug: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  date: string;
  _embedded: {
    author: Array<{
      name: string;
      link: string;
      avatar_urls: { [key: string]: string };
    }>;
    "wp:featuredmedia": Array<{ source_url: string; alt_text: string }>;
    "wp:term": Array<Array<{ name: string; id: number }>>;
  };
}

export const columns: ColumnDef<WPPage>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      return <div className="capitalize">{row.original.title.rendered}</div>;
    },
    filterFn: (row, id, filterValue) => {
      return row.original.title.rendered
        .toLowerCase()
        .includes(filterValue.toLowerCase());
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return <div className="capitalize">{row.getValue("status")}</div>;
    },
  },

  {
    accessorKey: "author",
    header: () => <div>Author</div>,
    cell: ({ row }) => {
      return (
        <div className="capitalize">
          {row.original._embedded.author[0].name}
        </div>
      );
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase">
        {new Date(row.getValue("date")).toLocaleDateString()}
      </div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>

            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Pencil />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Trash2 />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function PagesRoute() {
  const { pages } = useLoaderData<typeof loader>();

  return (
    <div>
      <DataTable data={pages} columns={columns} />
    </div>
  );
}
