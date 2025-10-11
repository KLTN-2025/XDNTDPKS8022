"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IDiscount } from "../page";
import DeleteDisCount from "./DeleteDisCount";
import { formatDate } from "@/lib/formatDate";
import UpdateDisCount from "./UpdateDisCount";

interface TableDiscountProps {
  discounts: IDiscount[];
}

const TableDiscount = ({ discounts }: TableDiscountProps) => {
  return (
    <div className="rounded-md border px-5 bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mã Giảm Giá</TableHead>
            <TableHead>Phần Trăm Giảm Giá (%)</TableHead>
            <TableHead>Ngày Bắt Đầu</TableHead>
            <TableHead>Ngày Kết Thúc</TableHead>
            <TableHead className="text-right">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {discounts.map((discount) => (
            <TableRow key={discount.id}>
              <TableCell className="font-medium">{discount.code}</TableCell>
              <TableCell>{discount.percentage}%</TableCell>
              <TableCell>{formatDate(discount.validFrom)}</TableCell>
              <TableCell>
                {formatDate(discount.validTo)}{" "}
                {new Date(discount.validTo) < new Date() && (
                  <span className="ml-2 inline-block px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded-full">
                    Hết hạn
                  </span>
                )}
              </TableCell>

              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <UpdateDisCount discounts={discount} />
                  <DeleteDisCount id={discount.id} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableDiscount;
