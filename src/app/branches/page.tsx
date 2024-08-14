"use client";
import DropdownSearch from "@/components/Filter/DropdownSearch";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
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
import { Edit, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Axios from "@/lib/axios";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const Branches = () => {
  const [branchData, setBranchData] = useState<any>([]);
  const [addBranch, setAddBranch] = useState(false);
  const [newBranchData, setNewBranchData] = useState<any>({
    id: "",
    name: "",
    state: "",
    city: "",
    address: "",
  });
  const [filterData, setFilterData] = React.useState<any>({
    state: "",
    city: "",
  });

  const getBranches = async (filter : any) => {
    try {
      await Axios.get(`/branches/?${filter}`).then((res) => {
        setBranchData(res?.data?.data);
      });
    } catch (error) {
      console.log("error");
    }
  };

  useEffect(() => {
    getBranches("");
  }, []);

  const addNewBranch = async (data: any) => {
    if (data.name && data.state && data.city && data.address) {
      const newBranch = {
        name: data.name,
        state: data.state,
        city: data.city,
        address: data.address,
      };
      try {
        await Axios.post("/branches", newBranch);
        getBranches("");
        setNewBranchData({
          id: "",
          name: "",
          state: "",
          city: "",
          address: "",
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const updateBranch = async (data: any) => {
    if (data.id && data.name && data.state && data.city && data.address) {
      const newBranch = {
        name: data.name,
        state: data.state,
        city: data.city,
        address: data.address,
      };
      try {
        await Axios.put(`/branches/${data.id}`, newBranch);
        getBranches("");
      } catch (error) {
        console.log(error);
      }
    }
  };

  const deleteBranch = async (id: any) => {
    try {
      await Axios.delete(`/branches/${id}`);
      getBranches("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleNewBook = () => {
    if (addBranch) {
      addNewBranch(newBranchData);
    } else {
      updateBranch(newBranchData);
      return;
    }
  };

  const handleFilter = (data: any) => {
    const filterData = {
      state: data?.state,
      city: data?.city,
    };
    getBranches(`state=${filterData.state}&city=${filterData.city}`);
  };

  const handleClear = () => {
    setFilterData({
      state: "",
      city: "",
    });
    getBranches("");
  };

  return (
    <Dialog>
      <main className="flex flex-col gap-8 w-full my-8 px-4 md:px-12 lg:px-24">
        {/* Filter */}
        <div className="flex flex-wrap justify-between items-end gap-4">
          <div className="flex flex-wrap gap-2 mt-2 max-h-max">
            <Input
              placeholder="State"
              className="md:w-[20rem]"
              value={filterData.state}
              onChange={(e) =>
                setFilterData({ ...filterData, state: e.target.value })
              }
            />
            <Input
              placeholder="City"
              className="md:w-[20rem]"
              value={filterData.city}
              onChange={(e) =>
                setFilterData({ ...filterData, city: e.target.value })
              }
            />
            <div>
              <Button
                variant={"default"}
                className="mr-2"
                onClick={() => handleFilter(filterData)}
              >
                Filter
              </Button>
              <Button variant={"secondary"} onClick={handleClear}>
                Clear
              </Button>
            </div>
          </div>
          <div className="mr-4">
            <DialogTrigger asChild>
              <Button
                className="bg-green-100 border border-green-500 font-medium text-foreground hover:bg-green-500 hover:text-background"
                onClick={() => setAddBranch(true)}
              >
                <Plus className="mr-1" /> Add Branch
              </Button>
            </DialogTrigger>
          </div>
        </div>

        {/* Branches */}
        <div>
          <Table>
            {/* <TableCaption>A list of your present Branches.</TableCaption> */}
            <TableHeader>
              <TableRow className="bg-slate-700 hover:bg-slate-600">
                <TableHead className="text-background">Branch Name</TableHead>
                <TableHead className="text-background">State</TableHead>
                <TableHead className="text-background">City</TableHead>
                <TableHead className="w-[35rem] text-background">
                  Address
                </TableHead>
                <TableHead className="w-[12rem] text-background">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {branchData.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.state}</TableCell>
                  <TableCell>{item.city}</TableCell>
                  <TableCell className="">{item.address}</TableCell>
                  <TableCell className="flex gap-2">
                    <DialogTrigger>
                      <div
                        className="p-2 bg-green-100 text-green-500 hover:bg-green-500 hover:text-background rounded-full cursor-pointer transition-all"
                        onClick={() => {
                          setAddBranch(false);
                          setNewBranchData({
                            ...newBranchData,
                            id: item?.id,
                            name: item?.name,
                            state: item?.state,
                            city: item?.city,
                            address: item?.address,
                          });
                        }}
                      >
                        <Edit size={20} />
                      </div>
                    </DialogTrigger>
                    <div
                      className="p-2 bg-red-100 text-red-500 hover:bg-red-500 hover:text-background rounded-full cursor-pointer transition-all"
                      onClick={() => deleteBranch(item?.id)}
                    >
                      <Trash2 size={20} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
      {/* Modal */}
      {addBranch ? (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a new branch</DialogTitle>
            <DialogDescription>
              Add the necessary details about the branch here.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <Input
              placeholder="Branch Name"
              className="md:w-[20rem]"
              onChange={(e) =>
                setNewBranchData({ ...newBranchData, name: e.target.value })
              }
            />
            <Input
              placeholder="State"
              className="md:w-[20rem]"
              onChange={(e) =>
                setNewBranchData({ ...newBranchData, state: e.target.value })
              }
            />
            <Input
              placeholder="City"
              className="md:w-[20rem]"
              onChange={(e) =>
                setNewBranchData({ ...newBranchData, city: e.target.value })
              }
            />
            <Textarea
              placeholder="Address"
              className="md:w-[20rem]"
              onChange={(e) =>
                setNewBranchData({ ...newBranchData, address: e.target.value })
              }
            />
          </div>
          <DialogFooter>
            <Button type="submit" onClick={() => handleNewBook()}>
              Add Branch
            </Button>
          </DialogFooter>
        </DialogContent>
      ) : (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Branch</DialogTitle>
            <DialogDescription>
              Add the details you want to change here.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <Input
              placeholder="Branch Name"
              className="md:w-[20rem]"
              value={newBranchData.name}
              onChange={(e) =>
                setNewBranchData({ ...newBranchData, name: e.target.value })
              }
            />
            <Input
              placeholder="State"
              className="md:w-[20rem]"
              value={newBranchData.state}
              onChange={(e) =>
                setNewBranchData({ ...newBranchData, state: e.target.value })
              }
            />
            <Input
              placeholder="City"
              className="md:w-[20rem]"
              value={newBranchData.city}
              onChange={(e) =>
                setNewBranchData({ ...newBranchData, city: e.target.value })
              }
            />
            <Textarea
              placeholder="Address"
              className="md:w-[20rem]"
              value={newBranchData.address}
              onChange={(e) =>
                setNewBranchData({ ...newBranchData, address: e.target.value })
              }
            />
          </div>
          <DialogFooter>
            <Button type="submit" onClick={() => handleNewBook()}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default Branches;
