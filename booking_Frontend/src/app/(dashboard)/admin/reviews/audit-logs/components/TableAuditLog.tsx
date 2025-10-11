import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";
import moment from "moment";
export interface AuditLog {
  id: string;
  action: string;
  entity: string;
  userType?: "Customer" | "Employee" | "System" | null;
  details?: string | null;
  createdAt: Date;
  lastName: string;
  firstName: string;
}

moment.locale("vi");

interface IAuditLogProps {
  auditLogs: AuditLog[];
}

const TableAuditLog = ({ auditLogs }: IAuditLogProps) => {
  return (
    <div className="p-6 bg-white border rounded-xl ">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Hành Động</TableHead>
              <TableHead>Đối Tượng</TableHead>
              <TableHead>Người Dùng</TableHead>
              <TableHead>Chi Tiết</TableHead>
              <TableHead>Thời Gian</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              auditLogs && auditLogs.length > 0 ? (
                auditLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">{log.action}</TableCell>
                    <TableCell>{log.userType || "Hệ thống"}</TableCell>
                    <TableCell>
                      {log.firstName + " " + log.lastName || "Hệ thống"}
                    </TableCell>
                    <TableCell>{log.details || "-"}</TableCell>
                    <TableCell>{moment(log.createdAt).fromNow()}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-7">
                    Hôm Nay Chưa Có Hoạt Động Nào
                  </TableCell>
                </TableRow>
              ) // ✅ dùng null nếu không render gì
            }
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TableAuditLog;
