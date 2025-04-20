import { Link, useLoaderData } from "react-router";
import type { Route } from "./+types/posts";
import { DataTable } from "~/components/data-table";
import { type ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "~/components/ui/checkbox";
import { Button } from "~/components/ui/button";
import { ArrowUpDown } from "lucide-react";
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
    `${process.env.WORDPRESS_API_URL}/wp-json/wp/v2/posts?_embed`
  );
  const posts = await response.json();
  return { posts };
}

interface WPPost {
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

export const columns: ColumnDef<WPPost>[] = [
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
    accessorKey: "categories",
    header: () => <div>Categories</div>,
    cell: ({ row }) => {
      const categories = row.original._embedded["wp:term"]?.[0] || [];

      return (
        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <span
              key={category.id}
              className="capitalize rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600"
            >
              {category.name}
            </span>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "tags",
    header: () => <div>Tags</div>,
    cell: ({ row }) => {
      const tags = row.original._embedded["wp:term"]?.[1] || [];

      return (
        <div className="flex gap-2 flex-wrap">
          {tags.map((tag) => (
            <span
              key={tag.id}
              className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-500"
            >
              {tag.name}
            </span>
          ))}
        </div>
      );
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
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function PostsRoute() {
  const { posts } = useLoaderData<typeof loader>();

  return (
    <div>
      <DataTable data={posts} columns={columns} />
    </div>
  );
}
