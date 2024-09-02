"use client";

import React, { SyntheticEvent, useState } from "react";
import { Button } from "@/components/button";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import Loader from "../dashboard/loader";
import { setAccountDetails } from "@/lib/user";
import { useFormState } from "react-dom";

interface RegistrationFormProps {
  activeSports: string[];
}

const initialState = {
  message: "",
};

const RegistrationForm: React.FC<RegistrationFormProps> = ({
  activeSports,
}) => {
  const [state, formAction, pending] = useFormState(
    setAccountDetails,
    initialState
  );
  const [selectedSports, setSelectedSports] = useState<string[]>([]);

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  const handleSportsChange = (
    event: SyntheticEvent<Element, Event>,
    value: string[]
  ) => {
    setSelectedSports(value);
  };

  return (
    <div className="relative space-y-2">
      {pending && <Loader />}
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
            minLength={5}
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
            options={activeSports}
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
          aria-disabled={pending}
          disabled={pending}
        >
          {pending ? "Creating account..." : "Confirm"}
        </Button>
        {state?.message && (
          <div className="flex items-center space-x-2 text-sm text-red-600">
            <ExclamationCircleIcon className="h-5 w-5" />
            <span>{state?.message}</span>
          </div>
        )}
      </form>
    </div>
  );
};

export default RegistrationForm;
