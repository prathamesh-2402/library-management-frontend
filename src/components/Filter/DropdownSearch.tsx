import React, { useEffect, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { dropdownSearchData } from "@/lib/data";

const DropdownSearch = ({
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
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  // setValue({ ...value, value : defaultValue === data?.[name] ? defaultValue : data?.[name]});
  useEffect(() => {
    if (value) {
      setData({ ...data, [name]: value });
    }
  }, [value]);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between"
        >
          {value
            ? dropdownData?.find((data: any) => data.id === value)?.name
            : `Select ${placeholder}`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder={`Select ${placeholder}`} value={defaultValue} />
          <CommandList>
            <CommandEmpty>No {placeholder} found.</CommandEmpty>
            <ScrollArea className="h-52">
              <CommandGroup>
                {dropdownData?.map((data: any) => (
                  <CommandItem
                    key={data.id}
                    value={data.name}
                    onSelect={(currentValue) => {

                      setValue(dropdownData?.find((data: any) => data.name === currentValue)?.id);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === data.name ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {data.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default DropdownSearch;
