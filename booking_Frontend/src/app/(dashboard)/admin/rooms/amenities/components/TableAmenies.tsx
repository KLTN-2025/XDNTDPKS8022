"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";

import DeleteAmenies from "./DeleteAmenies";
import UpdateAmenies from "./UpdateAmenies";
interface Amenity {
  id: string;
  name: string;
  description: string;
}

interface IAmenities {
  amenities: Amenity[];
}

const TableAmenies = ({ amenities }: IAmenities) => {
  if (!amenities || amenities.length === 0) {
    return <div>Không có tiện nghi nào</div>;
  }

  return (
    <div className="bg-white p-6 rounded-xl">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tên Tiện Nghi</TableHead>
            <TableHead>Mô Tả</TableHead>
            <TableHead className="text-right">Thực Hiện</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {amenities.map((amenity) => (
            <TableRow key={amenity.id}>
              <TableCell>{amenity.name}</TableCell>
              <TableCell>{amenity.description}</TableCell>
              <TableCell className="text-right">
                <UpdateAmenies amenities={amenity} />
                <DeleteAmenies id={amenity.id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableAmenies;
