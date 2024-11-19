"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  blockUserService,
  getUsersService,
  unBlockUserService,
} from "@/services/user";
import { dateConverter } from "@/utils/date-formatter";
import { useEffect, useState } from "react";
import { Lock01, LockUnlocked01 } from "@untitled-ui/icons-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { IUser } from "@/types/user.type";

export default function UserAdminPage() {
  const [users, setUsers] = useState<IUser[]>([]);
  const fetchData = async () => {
    const res = await getUsersService();
    if (res.statusCode == 200) {
      setUsers(res.data);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleBlockUser = async (id: string, isBlocked: boolean) => {
    const res = isBlocked
      ? await unBlockUserService(id)
      : await blockUserService(id);
    console.log(res);
    if (res.statusCode == 200) {
      toast({
        title: "Success",
        description: res.message,
      });
      fetchData();
    } else {
      toast({
        title: "Failed",
        description: res.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <h1 className="font-semibold text-2xl">User Management</h1>
      <div className="mt-8">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Join Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="flex justify-end items-center">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user, i) => (
              <TableRow key={i}>
                <TableCell className="w-52">{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{dateConverter(user.createdAt)}</TableCell>
                <TableCell>{user.isBlocked ? "Blocked" : "Active"}</TableCell>
                <TableCell className="flex justify-end gap-2">
                  <Button
                    onClick={() => toggleBlockUser(user.id, user.isBlocked)}
                  >
                    {user.isBlocked ? <LockUnlocked01 /> : <Lock01 />}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
