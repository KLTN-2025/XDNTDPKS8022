"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Search } from "lucide-react";
import { formatDate } from "@/lib/formatDate";
import AddEmployee from "./AddEmployee";
import DisabledUser from "./DisabledUser";
import PermissionEmployee from "./PermissionEmployee";
import toast from "react-hot-toast";
import axios from "axios";
import { URL_API } from "@/lib/fetcher";
import EmployeeRoleAction from "./EmployeeRoleAction";
import SearchForm from "@/app/(dashboard)/components/searchPage/SearchForm";
import Mutate from "@/hook/Mutate";

interface EmployeeDetails {
  id: string;
  department: string;
  hireDate: string;
  position: string;
  roles: { id: string; role: { name: string } }[];
}

export interface Employee {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  userType: string;
  status: string;
  employee: EmployeeDetails | null;
}

const departmentMap: Record<string, string> = {
  FRONT_DESK: "Lễ tân",
  MAINTENANCE: "Bảo trì",
  MANAGEMENT: "Quản Lý",
};

interface IEmployees {
  employee: Employee[];
  search: string;
  setSearchTerm: (value: string) => void;
  setCurrentPage: (value: number) => void;
}

const TableEmployee = ({
  employee,
  search,
  setSearchTerm,
  setCurrentPage,
}: IEmployees) => {
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [idEmployee, setIdEmployee] = useState<string | null>(null);
  async function RemoveEmployeeRole(id: string) {
    try {
      await axios.delete(`${URL_API}/api/role/${id}`, {
        withCredentials: true,
      });
      toast.success("Hủy quyền thành công!");
      Mutate(`${URL_API}/api/auth/employee`);
      setIsPermissionModalOpen(false);
    } catch (error: any) {
      toast.error(
        error.response.data.message || "Đã xảy ra lỗi khi hủy quyền nhân viên."
      );
    }
  }

  function OpenModalGetId(id: string) {
    setIsPermissionModalOpen(true);
    setIdEmployee(id);
  }
  return (
    <div className="space-y-4 bg-white p-5 rounded border">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <SearchForm
          placeholder="Tìm Theo Tên Nhân Viên .... "
          search={search}
          resetPage={false}
          setSearch={setSearchTerm}
          setPage={setCurrentPage}
        />
        <AddEmployee />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Họ và tên</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="hidden md:table-cell">
                Số điện thoại
              </TableHead>
              <TableHead className="hidden md:table-cell">Phòng ban</TableHead>
              <TableHead className="hidden md:table-cell">Vị trí</TableHead>
              <TableHead className="hidden md:table-cell">
                Ngày vào làm
              </TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Vai Trò</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employee.length > 0 ? (
              employee.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">
                    {employee.lastName} {employee.firstName}
                  </TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {employee.phone}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {employee.employee?.department
                      ? departmentMap[employee.employee.department] ||
                        employee.employee.department
                      : "Chưa phân công"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {employee.employee?.position || "Chưa phân công"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {employee.employee?.hireDate
                      ? formatDate(
                          new Date(employee.employee.hireDate).toString()
                        )
                      : "Chưa cập nhật"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        employee.status === "ACTIVE" ? "default" : "destructive"
                      }
                      className="capitalize"
                    >
                      {employee.status === "ACTIVE"
                        ? "Đang làm việc"
                        : "Đã nghỉ việc"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {employee.employee?.roles[0]?.role?.name ||
                      "Chưa được Cấp Quyền"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 cursor-pointer"
                        >
                          <span className="sr-only">Mở menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {/* phân quyền && hủy quyền */}
                        <EmployeeRoleAction
                          OpenModalGetId={OpenModalGetId}
                          RemoveEmployeeRole={RemoveEmployeeRole}
                          employee={employee}
                        />

                        {/* vô hiệu hóa  */}
                        <DisabledUser employee={employee} />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  Không tìm thấy nhân viên nào.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <PermissionEmployee
        idEmployee={idEmployee ?? ""}
        isOpen={isPermissionModalOpen}
        setIsOpen={setIsPermissionModalOpen}
      />
    </div>
  );
};

export default TableEmployee;
