import React, { useEffect, useRef, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { cn } from "@/lib/utils";

export type DropdownDataProps = {
  value: string;
  label: string;
};

interface DropdownProps {
  value: string | null;
  onChange: (value: string | null) => void;
  options: DropdownDataProps[];
  fetchData: ({ page, keyword }: { page?: number; keyword?: string }) => void;
  getNextPage: ({ keyword }: { keyword?: string }) => void;
  placeholder: string;
}

const Dropdown = ({
  value,
  onChange,
  options,
  fetchData,
  getNextPage,
  placeholder = "Select Option",
}: DropdownProps) => {
  const listRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchData({ page: 1, keyword: search });
  }, [fetchData, search]);

  useEffect(() => {
    if (open && options.length < 10) {
      getNextPage({ keyword: search });
    }
  }, [open, options.length, getNextPage, search]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      getNextPage({ keyword: search });
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div>
        <PopoverTrigger className="w-full" asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between truncate"
          >
            {value
              ? options.find((option) => option.value === value)
                ? options.find((option) => option.value === value)?.label
                : value
              : placeholder}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
      </div>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder="Search..."
            className="h-9"
            value={search}
            onValueChange={setSearch}
          />
          <CommandList ref={listRef} onScroll={handleScroll}>
            <CommandEmpty>
              {options.length === 0 && "No data found."}
            </CommandEmpty>
            <CommandGroup>
              {options.length > 0 &&
                options.map((item) => {
                  return (
                    <CommandItem
                      key={item.value}
                      value={item.value}
                      onSelect={() => {
                        onChange(item.value === value ? null : item.value);
                        setOpen(false);
                      }}
                    >
                      {item.label}
                      <Check
                        className={cn(
                          "ml-auto",
                          value === item.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  );
                })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default Dropdown;
