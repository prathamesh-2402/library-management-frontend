"use client";

import React, { useEffect, useState } from "react";
import Dropdown from "@/components/Filter/Dropdown";
import { Button } from "@/components/ui/button";
import { BookOpenText, Edit, Plus, Trash } from "lucide-react";
import Image from "next/image";
import line from "../../public/line.svg";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { fontSans } from "@/lib/fonts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Axios from "@/lib/axios";
import { Skeleton } from "@/components/ui/skeleton";
import { generateUniqueId } from "@/lib/generateIsbn";

export default function Home() {
  const router = useRouter();
  const [modalState, setModalState] = useState(false);
  const [loading, setLoading] = useState(false);
  const [booksData, setBooksData] = useState<any>([]);
  const [branchesData, setBranchesData] = useState<any>([]);
  const [addBook, setAddBook] = useState(false);
  const [newBookData, setNewBookData] = useState<any>({
    id: "",
    title: "",
    author: "",
    isbn: "",
    genre: "",
    quantity: "",
    branch_id: "",
    availability: "",
  });
  const [filterData, setFilterData] = React.useState<any>({
    title: "",
    author: "",
    genre: "",
    branch: "",
    availability: "",
  });
  const Avail = [
    { id: 1, name: "Available" },
    { id: 2, name: "Checked Out" },
    { id: 3, name: "Reserved" },
  ];
  const Genre = [
    { id: 1, name: "Fiction" },
    { id: 2, name: "Non-Fiction" },
    { id: 3, name: "Action" },
    { id: 4, name: "Drama" },
    { id: 5, name: "Horror" },
    { id: 6, name: "Romance" },
    { id: 7, name: "Comedy" },
  ];
  const getBooks = (filters: any) => {
    try {
      setLoading(true);
      Axios.get(`/books/?${filters}`).then((res) => {
        setBooksData(res?.data?.data);
      });
      setLoading(false);
    } catch (error) {
      setLoading(true);
      console.log(error);
    }
  };

  const getBranches = async () => {
    try {
      await Axios.get("/branches").then((res) => {
        setBranchesData(res?.data?.data);
      });
    } catch (error) {
      console.log("error from me");
    }
  };

  const addNewBook = async (data: any) => {
    if (
      data.title &&
      data.author &&
      data.genre &&
      data.quantity &&
      data.branch_id &&
      data.availability
    ) {
      const newBook = {
        title: data.title,
        author: data.author,
        isbn: data.isbn,
        genre: data.genre,
        quantity: data.quantity,
        branch_id: data.branch_id,
        availability: Avail.find((item: any) => item.id === data.availability)
          ?.name,
      };
      try {
        const uniqueIsbn = generateUniqueId();
        newBook.isbn = uniqueIsbn;
        await Axios.post("/books", newBook);
        getBooks("");
        setNewBookData({
          id: "",
          title: "",
          author: "",
          isbn: "",
          genre: "",
          quantity: "",
          branch_id: "",
          availability: "",
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const updateBook = async (data: any) => {
    if (
      data.title &&
      data.author &&
      data.genre &&
      data.quantity &&
      data.branch_id &&
      data.availability
    ) {
      const newBook = {
        title: data.title,
        author: data.author,
        genre: data.genre,
        quantity: data.quantity,
        branch_id: data.branch_id,
        availability: Avail.find((item: any) => item.id === data.availability)
          ?.name,
      };
      try {
        await Axios.put(`/books/${data.id}`, newBook);
        getBooks("");
      } catch (error) {
        console.log(error);
      }
    }
  };

  const deleteBook = async (id: any) => {
    try {
      await Axios.delete(`/books/${id}`);
      getBooks("");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBooks("");
    getBranches();
  }, []);

  const handleNewBook = () => {
    if (addBook) {
      addNewBook(newBookData);
    } else {
      updateBook(newBookData);
      return;
    }
  };

  const handleFilter = (data: any) => {
    const filterData = {
      title: data?.title,
      author: data?.author,
      genre: Genre.find((item : any) => item.id === data?.genre)?.name,
      branch: data?.branch,
      availability: Avail.find((item : any) => item.id === data?.availability)?.name
    };
    // console.log("book filter: ", filterData);
    getBooks(`title=${filterData.title}&author=${filterData.author}&genre=${filterData.genre === undefined ? "" : filterData.genre}&branch_id=${filterData.branch}&availability=${filterData.availability === undefined ? "" : filterData.availability}`);
  };

  const handleClear = () => {
    setFilterData({
      title: "",
      author: "",
      genre: "",
      branch: "",
      availability: "",
    });
    getBooks("");
  };

  return (
    <Dialog>
      <main className="flex flex-col gap-8 w-full my-8 px-4 md:px-12 lg:px-24">
        {/* Filter */}
        <div className="flex flex-wrap justify-between items-end gap-4">
          <div className="flex flex-wrap gap-2 mt-2 max-h-max">
            <Input
              placeholder="Title"
              className="md:w-[20rem]"
              value={filterData.title}
              onChange={(e) =>
                setFilterData({ ...filterData, title: e.target.value })
              }
            />
            <Input
              placeholder="Author"
              className="md:w-[20rem]"
              value={filterData.author}
              onChange={(e) =>
                setFilterData({ ...filterData, author: e.target.value })
              }
            />
            <Dropdown
              placeholder={"Select Genre"}
              data={filterData}
              defaultValue=""
              setData={setFilterData}
              dropdownData={Genre}
              name={"genre"}
            />
            <Dropdown
              placeholder={"Branch"}
              data={filterData}
              defaultValue=""
              setData={setFilterData}
              dropdownData={branchesData}
              name={"branch"}
            />
            <Dropdown
              placeholder={"Select Availability"}
              data={filterData}
              defaultValue=""
              setData={setFilterData}
              dropdownData={Avail}
              name={"availability"}
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
            <DialogTrigger asChild data-state="closed">
              <Button
                className="bg-green-100 border border-green-500 font-medium text-foreground hover:bg-green-500 hover:text-background"
                onClick={() => setAddBook(true)}
              >
                <Plus className="mr-1" /> Add Book
              </Button>
            </DialogTrigger>
          </div>
        </div>

        {/* Books */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
          {!loading ? (
            booksData?.map((item: any) => (
              <div
                className={`flex flex-col items-center text-background ${fontSans.className}`}
                key={item?.id}
              >
                <div
                  className="flex flex-col items-center justify-between w-[17rem] h-[21rem] bg-gradient-to-br from-gray-900 to-gray-700 border rounded-l-[10px] p-4 shadow-md relative"
                  onClick={() => {
                    router.push(`/${item?.id}`);
                  }}
                >
                  {/* Bookmark Icon */}
                  <Image
                    src="/bookmark.svg"
                    alt="bookmark-icon"
                    width={50}
                    height={50}
                    className="absolute left-0 -top-1"
                  />
                  {/* Lines */}
                  <Image
                    src={line}
                    alt="line"
                    className="absolute right-2 top-0"
                  />
                  <Image
                    src={line}
                    alt="line"
                    className="absolute right-[2px] top-0"
                  />

                  {/* Content */}
                  <div className="flex flex-col gap-2 mt-2 items-center text-center">
                    <h1 className="w-44 text-2xl font-bold">{item?.title}</h1>
                    <div>
                      <p className="text-sm">By</p>
                      <h1 className="text-lg">{item?.author}</h1>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 mt-2">
                    <div className="flex justify-center items-center">
                      <span
                        className={`w-3 h-3 ${
                          item?.availability === "Available"
                            ? "bg-emerald-500"
                            : item.availability === "Reserved"
                            ? "bg-sky-500"
                            : "bg-rose-500"
                        } rounded-full`}
                      />
                      <span className="px-2 py-1 text-center">
                        {item?.availability}
                      </span>
                    </div>
                    <h1>
                      Quantity: {item?.quantity} | {item?.genre}
                    </h1>
                  </div>

                  {/* Overlay */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center rounded-l-[10px] bg-black bg-opacity-50 text-white opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                    <BookOpenText size={40} />
                    <p className="mt-2 text-xl font-bold">Open</p>
                  </div>
                </div>

                {/* Edit and Delete */}
                <div className="flex gap-2 mt-2">
                  <DialogTrigger>
                    <div
                      className="bg-sky-500 text-background border-2 border-sky-500 hover:bg-sky-600 rounded-full p-2 cursor-pointer"
                      onClick={() => {
                        setAddBook(false);
                        setNewBookData({
                          ...newBookData,
                          id: item?.id,
                          title: item?.title,
                          author: item?.author,
                          genre: item?.genre,
                          quantity: item?.quantity,
                          branch_id: item?.branch_id,
                          availability: item?.availability,
                        });
                      }}
                    >
                      <Edit size={20} />
                    </div>
                  </DialogTrigger>
                  <div
                    className="bg-rose-500 text-background border-2 border-red-500 hover:bg-red-600 rounded-full p-2 cursor-pointer"
                    onClick={() => deleteBook(item?.id)}
                  >
                    <Trash size={20} />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <>
              <Skeleton className="w-[17rem] h-[21rem]" />
              <Skeleton className="w-[17rem] h-[21rem]" />
              <Skeleton className="w-[17rem] h-[21rem]" />
              <Skeleton className="w-[17rem] h-[21rem]" />
              <Skeleton className="w-[17rem] h-[21rem]" />
            </>
          )}
        </div>
      </main>
      {/* Modal */}
      {addBook ? (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a new book</DialogTitle>
            <DialogDescription>
              Add the necessary details about the book here.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <Input
              placeholder="Title"
              onChange={(e) =>
                setNewBookData({ ...newBookData, title: e.target.value })
              }
            />
            <Input
              placeholder="Author"
              onChange={(e) =>
                setNewBookData({ ...newBookData, author: e.target.value })
              }
            />
            <Input
              placeholder="Genre"
              onChange={(e) =>
                setNewBookData({ ...newBookData, genre: e.target.value })
              }
            />
            <Input
              placeholder="Quantity"
              type="number"
              onChange={(e) =>
                setNewBookData({ ...newBookData, quantity: e.target.value })
              }
            />
            <Dropdown
              placeholder="Branches"
              data={newBookData}
              defaultValue=""
              setData={setNewBookData}
              dropdownData={branchesData}
              name={"branch_id"}
            />
            <Dropdown
              placeholder="Availability"
              data={newBookData}
              defaultValue=""
              setData={setNewBookData}
              dropdownData={Avail}
              name={"availability"}
            />
          </div>
          <DialogFooter>
            <Button type="submit" onClick={() => handleNewBook()}>
              Add Book
            </Button>
          </DialogFooter>
        </DialogContent>
      ) : (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit book</DialogTitle>
            <DialogDescription>
              Add the details you want to change here.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <Input
              placeholder="Title"
              value={newBookData.title}
              onChange={(e) =>
                setNewBookData({ ...newBookData, title: e.target.value })
              }
            />
            <Input
              placeholder="Author"
              value={newBookData.author}
              onChange={(e) =>
                setNewBookData({ ...newBookData, author: e.target.value })
              }
            />
            <Input
              placeholder="Genre"
              value={newBookData.genre}
              onChange={(e) =>
                setNewBookData({ ...newBookData, genre: e.target.value })
              }
            />
            <Input
              placeholder="Quantity"
              type="number"
              value={Number(newBookData.quantity)}
              onChange={(e) =>
                setNewBookData({ ...newBookData, quantity: e.target.value })
              }
            />
            <Dropdown
              placeholder="Branches"
              defaultValue={newBookData.branch_id}
              data={newBookData}
              setData={setNewBookData}
              dropdownData={branchesData}
              name={"branch_id"}
            />
            <Dropdown
              placeholder="Availability"
              data={newBookData}
              defaultValue={
                Avail?.find(
                  (item: any) => item?.name === newBookData?.availability
                )?.id
              }
              setData={setNewBookData}
              dropdownData={Avail}
              name={"availability"}
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
}
