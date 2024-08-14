"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Axios from "@/lib/axios";
import { Input } from "@/components/ui/input";

const Transfer = () => {
  const [transferData, setTransferData] = useState<any>([]);
  const [branchData, setBranchData] = useState<any>([]);
  const [newTransferData, setNewTransferData] = useState<any>({
    isbn: "",
    from_branch: "",
    to_branch: "",
  });

  const getTransfer = async () => {
    try {
      await Axios.get("/transfer").then((res) => {
        setTransferData(res?.data?.data);
      });
    } catch (error) {
      console.log("error");
    }
  };

  const getBranch = () => {
    try {
      Axios.get(`/branches/`).then((res) => {
        setBranchData(res?.data?.data);
      });
      // setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const newTransfer = async (data: any) => {
    if (data.isbn && data.from_branch && data.to_branch) {
      const newTransfer = {
        isbn: data?.isbn,
        from_branch: branchData.find((item: any) => item?.name === data?.from_branch)?.id,
        to_branch: branchData.find((item: any) => item?.name === data?.to_branch)?.id,
      };
      try {
        await Axios.post("/transfer", newTransfer);
        getTransfer();
        setNewTransferData({
          isbn: "",
          from_branch: "",
          to_branch: "",
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    getTransfer();
    getBranch();
  }, []);

  const handleNewBook = () => {
    newTransfer(newTransferData);
  };

  return (
    <Dialog>
    <main className="flex flex-col gap-8 w-full my-8 px-4 md:px-12 lg:px-24">
      <DialogTrigger asChild>
        <div>
          <Button className="bg-green-100 border border-green-500 font-medium text-foreground hover:bg-green-500 hover:text-background"><Plus className="mr-1"/> Transfer Book</Button>
        </div>
      </DialogTrigger>
      {/* Branches */}
      <div>
        <h1 className="mb-2 font-medium text-xl">Transfer History</h1>
        <Table>
          {/* <TableCaption>A list of your present branches.</TableCaption> */}
          <TableHeader>
            <TableRow className="bg-slate-700 hover:bg-slate-600">
              <TableHead className="text-background">ISBN</TableHead>
              <TableHead className="text-background">Date</TableHead>
              <TableHead className="text-background">From</TableHead>
              <TableHead className="text-background">To</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transferData.map((item: any) => (
              <TableRow key={item?.id}>
                <TableCell>{item?.isbn}</TableCell>
                <TableCell>{item?.created_at?.substring(0,10)}</TableCell>
                <TableCell>{branchData.find((e: any) => e?.id === item?.from_branch)?.name}</TableCell>
                <TableCell>{branchData.find((e: any) => e?.id === item?.to_branch)?.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </main>
    {/* Modal */}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transfer Book</DialogTitle>
            <DialogDescription>
              Add the necessary details about the book here.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <Input
              placeholder="ISBN"
              type="number"
              onChange={(e) =>
                setNewTransferData({ ...newTransferData, isbn: e.target.value })
              }
            />
            <Input
              placeholder="From Branch"
              onChange={(e) =>
                setNewTransferData({ ...newTransferData, from_branch: e.target.value })
              }
            />
            <Input
              placeholder="To Branch"
              onChange={(e) =>
                setNewTransferData({ ...newTransferData, to_branch: e.target.value })
              }
            />
          </div>
          <DialogFooter>
            <Button type="submit" onClick={() => handleNewBook()}>
              Transfer
            </Button>
          </DialogFooter>
        </DialogContent>
    </Dialog>

  );
};

export default Transfer;
