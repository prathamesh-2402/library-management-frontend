"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Axios from "@/lib/axios";
import { fontSans } from "@/lib/fonts";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const Style = {
  left: {
    backgroundImage:
      "linear-gradient(to right, #fef3c7 60%, #fcf4c3 70% , #f7ecc1 85%, #c3bb99 95%, #555142 100%)",
  },
  right: {
    backgroundImage:
      "linear-gradient(to left, #fef3c7 80%, #f7ecc1 90%, #c3bb99 97%, #555142 100%)",
  },
};

const Page = () => {
  const params = useParams<{ id: any }>();
  const [bookData, setBookData] = useState<any>({});
  const [branchData, setBranchData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [branchLoading, setBranchLoading] = useState(false);

  const getBook = () => {
    try {
      const id = params.id;
      setLoading(true);
      setBranchLoading(true);
      Axios.get(`/books/${id}`).then((res) => {
        setBookData(res?.data?.data);
      });
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const getBranch = () => {
    try {
      Axios.get(`/branches/${bookData?.branch_id}`).then((res) => {
        setBranchData(res?.data?.data);
      });
      setLoading(false);
      setBranchLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBook();
  }, []);

  useEffect(() => {
    if (bookData?.branch_id) {
      getBranch();
    }
  }, [bookData]);

  return (
    <div
      style={{
        backgroundImage: 'url("/library-dark.jpg")',
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
      className={`min-h-screen flex justify-center items-center w-full h-full ${fontSans.className}`}
    >
      <Card
        style={Style.left}
        className="w-full sm:w-1/2 xl:w-1/3 min-h-[30rem] lg:min-h-[40rem] py-10 border-none"
      >
        <div className="flex flex-col justify-between items-center min-h-[25rem] lg:min-h-[35rem] gap-4 sm:gap-0">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold sm:w-[20rem] text-center">
            {bookData?.title}
          </h1>
          <div className="grid grid-cols-2 sm:hidden gap-2 px-12">
            <h1 className="text-xl font-semibold mb-1">ISBN</h1>
            <p>{bookData?.isbn}</p>
            <h1 className="text-xl font-semibold mb-1">Genre</h1>
            <p>{bookData?.genre}</p>
            <h1 className="text-xl font-semibold mb-1">Quantity</h1>
            <p>{bookData?.quantity}</p>
            <h1 className="text-xl font-semibold mb-1">Branch</h1>
            <p>{branchData?.name}</p>
            <h1 className="text-xl font-semibold mb-1">Status</h1>
            <p>{bookData?.availability}</p>
          </div>
          <div className="flex flex-col items-center">
            <svg width="50" height="4" xmlns="http://www.w3.org/2000/svg">
              <line x1="0" y1="0" x2="50" y2="0" stroke="black" />
            </svg>
            <p className="mt-0 md:mt-4">by</p>
            <h1 className="text-3xl font-bold italic mt-1 md:mt-3">
              {bookData?.author}
            </h1>
          </div>
        </div>
      </Card>
      <Card
        style={Style.right}
        className="hidden sm:block w-1/2 xl:w-1/3 min-h-[30rem] lg:min-h-[40rem] py-10 border-none"
      >
        {!loading && !branchLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 px-12">
            <h1 className="text-xl font-semibold mb-1">ISBN</h1>
            <p>{bookData?.isbn}</p>
            <h1 className="text-xl font-semibold mb-1">Genre</h1>
            <p>{bookData?.genre}</p>
            <h1 className="text-xl font-semibold mb-1">Quantity</h1>
            <p>{bookData?.quantity}</p>
            <h1 className="text-xl font-semibold mb-1">Branch</h1>
            <p>{branchData?.name}</p>
            <h1 className="text-xl font-semibold mb-1">Status</h1>
            <p>{bookData?.availability}</p>
          </div>
        ) : (
          <>
          <Skeleton className="w-[10rem]"/>
          <Skeleton className="w-[10rem]"/>
          <Skeleton className="w-[10rem]"/>
          <Skeleton className="w-[10rem]"/>
          <Skeleton className="w-[10rem]"/>
          <Skeleton className="w-[10rem]"/>
          </>
        )}
      </Card>
    </div>
  );
};

export default Page;
