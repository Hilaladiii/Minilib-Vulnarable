"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { dateTimeConverter } from "@/utils/date-formatter";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export default function TableCatalogAdmin({ catalog }: { catalog: any }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const setParamsType = (type: string = "RETURNED") => {
    const params = new URLSearchParams(searchParams);
    params.set("type", type);
    return `${pathname}?${params.toString()}`;
  };
  return (
    <div>
      <div>
        <Link href={setParamsType("RETURNED")}>Returned</Link>
        <Link href={setParamsType("BORROWED")}>Borrowed</Link>
        <Link href={setParamsType("OVERDUE")}>Overdue</Link>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Username</TableHead>
            <TableHead>Book</TableHead>
            <TableHead>Borrow Date</TableHead>
            <TableHead>Due Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {catalog.data.map((catalog: any, i: number) => (
            <TableRow key={i}>
              <TableCell className="w-52">{catalog.user.username}</TableCell>
              <TableCell>{catalog.book.title}</TableCell>
              <TableCell>{dateTimeConverter(catalog.borrow_date)}</TableCell>
              <TableCell>{dateTimeConverter(catalog.due_date)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
