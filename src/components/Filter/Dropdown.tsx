import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Dropdown = ({
  placeholder,
  data,
  setData,
  name,
  dropdownData,
  defaultValue,
}: {
  placeholder: string;
  data: any;
  setData: any;
  name: string;
  dropdownData: any;
  defaultValue: any;
}) => {
  return (
    <Select
      onValueChange={(value) => setData({ ...data, [name]: value })}
      defaultValue={defaultValue}
    >
      <SelectTrigger className="w-48">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {dropdownData?.map((item: any, key: any) => (
            <SelectItem value={item.id} key={key}>{item?.name}</SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default Dropdown;
