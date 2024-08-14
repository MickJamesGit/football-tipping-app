"use client";

import React, { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { setUsername } from "@/app/lib/actions";
import { Button } from "@/components/ui/button";
import {
  ArrowRightIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

interface RegistrationFormProps {
  sports: string[];
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ sports }) => {
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
    if (!errorMessage.error) {
      router.push("/dashboard");
    }
  }, [errorMessage, router]);

  const handleSportsChange = (event: any, value: string[]) => {
    setSelectedSports(value);
  };

  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-bold text-center mt-4 mb-4">
        Set up your account
      </h1>
      <form action={formAction} className="space-y-4">
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            className="block w-full rounded-md border border-gray-300 py-2 px-3 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
            id="alias"
            type="text"
            name="alias"
            placeholder="Enter your username"
            required
            minLength={6}
            maxLength={25}
          />
        </div>
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Competitions to Enter
          </label>
          <Autocomplete
            multiple
            id="selected-sports"
            options={sports}
            disableCloseOnSelect
            getOptionLabel={(option) => option}
            onChange={handleSportsChange}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox
                  icon={icon}
                  checkedIcon={checkedIcon}
                  style={{ marginRight: 8 }}
                  checked={selected}
                />
                {option}
              </li>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Sports"
                placeholder="Select sports"
                className="w-full"
              />
            )}
          />
        </div>
        <input
          type="hidden"
          name="selectedSports"
          value={JSON.stringify(selectedSports)}
        />
        <Button
          type="submit"
          className="w-full bg-blue-600 text-white flex items-center justify-center space-x-2 py-2"
          aria-disabled={isPending}
        >
          Confirm
          <ArrowRightIcon className="ml-2 h-5 w-5 text-white" />
        </Button>
        {errorMessage.error && (
          <div className="flex items-center space-x-2 text-sm text-red-600">
            <ExclamationCircleIcon className="h-5 w-5" />
            <span>{errorMessage.message}</span>
          </div>
        )}
      </form>
    </div>
  );
};

export default RegistrationForm;
