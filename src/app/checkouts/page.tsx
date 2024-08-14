"use client";

import React, { useEffect, useState } from "react";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon, Edit, Plus, Trash2 } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import Axios from "@/lib/axios";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/Filter/DatePicker";
import Dropdown from "@/components/Filter/Dropdown";

const Checkouts = ({ className }: React.HTMLAttributes<HTMLDivElement>) => {
  const [checkoutData, setCheckoutData] = useState<any>([]);
  const [addCheckout, setAddCheckout] = useState(false);
  const [newCheckoutData, setNewCheckoutData] = useState<any>({
    id: "",
    user_name: "",
    isbn: "",
    checkout_date: "",
    due_date: "",
    return_date: "",
    status: "",
  });
  const [filterData, setFilterData] = React.useState<any>({
    user_name: "",
    dateStart: "",
    dateEnd: "",
  });
  const Status = [
    { id: 1, name: "Checked Out" },
    { id: 2, name: "Returned" },
  ];
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 10),
  });

  const getCheckouts = async (filter: any) => {
    try {
      await Axios.get(`/checkouts/?${filter}`).then((res) => {
        setCheckoutData(res?.data?.data);
      });
    } catch (error) {
      console.log("error");
    }
  };

  useEffect(() => {
    getCheckouts("");
  }, []);

  const addNewCheckout = async (data: any) => {
    if (
      data.user_name &&
      data.isbn &&
      data.checkout_date &&
      data.due_date &&
      data.status
    ) {
      const newCheckout = {
        user_name: data.user_name,
        isbn: data.isbn,
        checkout_date: data.checkout_date,
        due_date: data.due_date,
        return_date: data.return_date,
        status: Status.find((item: any) => item?.id === data.status)?.name,
      };
      try {
        await Axios.post("/checkouts", newCheckout);
        getCheckouts("");
        setNewCheckoutData({
          id: "",
          user_name: "",
          isbn: "",
          checkout_date: "",
          due_date: "",
          return_date: "",
          status: "",
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const updateCheckout = async (data: any) => {
    if (
      data.id &&
      data.user_name &&
      data.isbn &&
      data.checkout_date &&
      data.due_date &&
      data.status
    ) {
      const newCheckout = {
        user_name: data.user_name,
        isbn: data.isbn,
        checkout_date: data.checkout_date,
        due_date: data.due_date,
        return_date: data.return_date,
        status: Status.find((item: any) => item?.id === data.status)?.name,
      };
      try {
        await Axios.put(`/checkouts/${data.id}`, newCheckout);
        getCheckouts("");
      } catch (error) {
        console.log(error);
      }
    }
  };

  const deleteCheckout = async (id: any) => {
    try {
      await Axios.delete(`/checkouts/${id}`);
      getCheckouts("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleNewCheckout = () => {
    if (addCheckout) {
      addNewCheckout(newCheckoutData);
    } else {
      updateCheckout(newCheckoutData);
      return;
    }
  };

  const handleFilter = (data: any) => {
    const dateStart = dateRange?.from;
    const dateEnd = dateRange?.to;

    dateStart?.setDate(dateStart.getDate() + 1);
    dateEnd?.setDate(dateEnd.getDate() + 1);

    const filterData = {
      user_name: data?.user_name,
      dateStart: dateStart?.toISOString().substring(0,10),
      dateEnd: dateEnd?.toISOString().substring(0,10),
    };

    console.log(filterData);

    getCheckouts(
      `user_name=${filterData.user_name}&dateStart=${filterData.dateStart}&dateEnd=${filterData.dateEnd}`
    );
  };

  const handleClear = () => {
    setFilterData({
      user_name: "",
      dateStart: "",
      dateEnd: "",
    });
    getCheckouts("");
  };

  return (
    <Dialog>
      <main className="flex flex-col gap-8 w-full my-8 px-4 md:px-12 lg:px-24">
        {/* Filter */}
        <div className="flex flex-wrap justify-between items-end gap-4">
          <div className="flex flex-wrap gap-2 mt-2 max-h-max">
            <Input
              placeholder="User"
              className="md:w-[20rem]"
              value={filterData.user_name}
              onChange={(e) =>
                setFilterData({ ...filterData, user_name: e.target.value })
              }
            />
            <div className={cn("grid gap-2", className)}>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "w-[300px] justify-start text-left font-normal",
                      !dateRange && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} -{" "}
                          {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
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
                onClick={() => setAddCheckout(true)}
              >
                <Plus className="mr-1" /> Add Checkout
              </Button>
            </DialogTrigger>
          </div>
        </div>

        {/* Checkouts */}
        <div>
          <Table>
            {/* <TableCaption>A list of your present branches.</TableCaption> */}
            <TableHeader>
              <TableRow className="bg-slate-700 hover:bg-slate-600">
                <TableHead className="text-background">UserId</TableHead>
                <TableHead className="text-background">ISBN</TableHead>
                <TableHead className="text-background">Checkout Date</TableHead>
                <TableHead className="text-background">Due Date</TableHead>
                <TableHead className="text-background">Return Date</TableHead>
                <TableHead className="text-background">Status</TableHead>
                <TableHead className="w-[12rem] text-background">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {checkoutData.map((item: any) => (
                <TableRow key={item?.id}>
                  <TableCell className="font-medium">
                    {item?.user_name}
                  </TableCell>
                  <TableCell>{item?.isbn}</TableCell>
                  <TableCell>{item?.checkout_date}</TableCell>
                  <TableCell>{item?.due_date}</TableCell>
                  <TableCell>{item?.return_date}</TableCell>
                  <TableCell>{item?.status}</TableCell>
                  <TableCell className="flex gap-2">
                    <DialogTrigger>
                      <div
                        className="p-2 bg-green-100 text-green-500 hover:bg-green-500 hover:text-background rounded-full cursor-pointer transition-all"
                        onClick={() => {
                          setAddCheckout(false);
                          setNewCheckoutData({
                            ...newCheckoutData,
                            id: item?.id,
                            user_name: item?.user_name,
                            isbn: item?.isbn,
                            checkout_date: item?.checkout_date,
                            due_date: item?.due_date,
                            return_date: item?.return_date,
                            status: item?.status,
                          });
                        }}
                      >
                        <Edit size={20} />
                      </div>
                    </DialogTrigger>
                    <div
                      className="p-2 bg-red-100 text-red-500 hover:bg-red-500 hover:text-background rounded-full cursor-pointer transition-all"
                      onClick={() => deleteCheckout(item?.id)}
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
      {addCheckout ? (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a new checkout</DialogTitle>
            <DialogDescription>
              Add the necessary details here.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <Input
              placeholder="User Name"
              className="md:w-[20rem]"
              onChange={(e) =>
                setNewCheckoutData({
                  ...newCheckoutData,
                  user_name: e.target.value,
                })
              }
            />
            <Input
              placeholder="Book ISBN"
              className="md:w-[20rem]"
              type="number"
              max={13}
              onChange={(e) =>
                setNewCheckoutData({ ...newCheckoutData, isbn: e.target.value })
              }
            />
            <DatePicker
              placeholder="Checkout Date"
              defaultValue=""
              data={newCheckoutData}
              setData={setNewCheckoutData}
              name={"checkout_date"}
            />
            <DatePicker
              placeholder="Due Date"
              defaultValue=""
              data={newCheckoutData}
              setData={setNewCheckoutData}
              name={"due_date"}
            />
            <DatePicker
              placeholder="Return Date"
              defaultValue=""
              data={newCheckoutData}
              setData={setNewCheckoutData}
              name={"return_date"}
            />
            <Dropdown
              placeholder="Status"
              data={newCheckoutData}
              defaultValue=""
              setData={setNewCheckoutData}
              dropdownData={Status}
              name={"status"}
            />
          </div>
          <DialogFooter>
            <Button type="submit" onClick={() => handleNewCheckout()}>
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
              onChange={(e) =>
                setNewCheckoutData({
                  ...newCheckoutData,
                  user_name: e.target.value,
                })
              }
            />
            <Input
              placeholder="State"
              className="md:w-[20rem]"
              onChange={(e) =>
                setNewCheckoutData({ ...newCheckoutData, isbn: e.target.value })
              }
            />

            <DatePicker
              placeholder="Checkout Date"
              defaultValue=""
              data={newCheckoutData}
              setData={setNewCheckoutData}
              name={"checkout_date"}
            />
            <DatePicker
              placeholder="Due Date"
              defaultValue=""
              data={newCheckoutData}
              setData={setNewCheckoutData}
              name={"due_date"}
            />
            <DatePicker
              placeholder="Return Date"
              defaultValue=""
              data={newCheckoutData}
              setData={setNewCheckoutData}
              name={"return_date"}
            />
            <Dropdown
              placeholder="Status"
              data={newCheckoutData}
              defaultValue=""
              setData={setNewCheckoutData}
              dropdownData={Status}
              name={"status"}
            />
          </div>
          <DialogFooter>
            <Button type="submit" onClick={() => handleNewCheckout()}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default Checkouts;
