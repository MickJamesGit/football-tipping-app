"use client";

import { setUsername } from "@/app/lib/actions";
import { lusitana } from "../fonts";
import { useActionState, useEffect, useState } from "react";
import { Button } from "../dashboard/button";
import {
  ArrowRightIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

const sports = ["NRL", "AFL"];

export default function LoginForm() {
  const router = useRouter();
  const initialState = { message: "", error: false };
  const [errorMessage, formAction, isPending] = useActionState(
    setUsername,
    initialState
  );
  const [selectedSports, setSelectedSports] = useState<string[]>([]);

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  useEffect(() => {
    if (errorMessage.error === false) {
      router.push("/dashboard");
    }
  }, [errorMessage, router]);

  const handleSportsChange = (event: any, value: string[]) => {
    setSelectedSports(value);
  };

  return (
    <form action={formAction} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`${lusitana.className} mb-3 text-2xl`}>
          Select a username and sports competitions to continue.
        </h1>
        <div className="w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="alias"
            >
              Username
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="alias"
                type="text"
                name="alias"
                placeholder="Enter your username"
                required
                minLength={6}
                maxLength={25}
              />
            </div>
          </div>
          <div className="w-full">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="competitions"
            >
              Competitions to enter
            </label>
            <div className="relative">
              <Autocomplete
                multiple
                id="selected-sports"
                options={sports}
                disableCloseOnSelect
                getOptionLabel={(option) => option}
                onChange={handleSportsChange}
                renderOption={(props, option, { selected }) => {
                  const { key, ...optionProps } = props;
                  return (
                    <li key={key} {...optionProps}>
                      <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected}
                      />
                      {option}
                    </li>
                  );
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Sports" placeholder="Sports" />
                )}
              />
            </div>
          </div>
          {/* Hidden input to include selected sports in form data */}
          <input
            type="hidden"
            name="selectedSports"
            value={JSON.stringify(selectedSports)}
          />
        </div>
        <Button type="submit" className="mt-4 w-full" aria-disabled={isPending}>
          Confirm <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Button>

        <div className="flex h-8 items-end space-x-1">
          {errorMessage.error && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{errorMessage.message}</p>
            </>
          )}
        </div>
      </div>
    </form>
  );
}
