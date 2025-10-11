import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface Role {
  name: string;
  permissions: any;
}

interface RoleTableProps {
  roles: Role[];
}

const RoleTable = ({ roles }: RoleTableProps) => {
  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tên Quyền</TableHead>
            <TableHead>Phân Quyền</TableHead>
            <TableHead>Hành Động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles.map((role, index) => (
            <TableRow key={index}>
              <TableCell>{role.name}</TableCell>
              <TableCell className="font-bold">
                {role.permissions.join(" , ")}
              </TableCell>
              <TableCell className="space-x-2">
                <Button variant="destructive" size="sm">
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default RoleTable;
