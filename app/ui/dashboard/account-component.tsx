"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import { useActionState, useEffect, useState } from "react";
import { States } from "./tipping-table";
import { updateAccountDetails } from "@/app/lib/actions";

export const metadata: Metadata = {
  title: "Account",
};

export default function AccountComponent({
  user,
}: {
  user: {
    name: string;
    alias: string;
    image: string;
    receiveTippingReminders: boolean;
    receiveTippingResults: boolean;
  };
}) {
  const initialState: States = { message: "", error: false };
  const [state, formAction] = useActionState(
    updateAccountDetails,
    initialState
  );
  const [username, setUsername] = useState(user.alias);
  const [tippingReminders, setTippingReminders] = useState(
    user.receiveTippingReminders
  );
  const [resultsNotifications, setResultsNotifications] = useState(
    user.receiveTippingResults
  );
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (state.message) {
      setOpen(true);
      setError(state.error);
    }
  }, [state]);

  useEffect(() => {
    if (!state.error) {
      // Update state based on submitted values
      setUsername(username);
      setTippingReminders(tippingReminders);
      setResultsNotifications(resultsNotifications);
    }
  }, [state, username, tippingReminders, resultsNotifications]);

  return (
    <>
      {open && !error && (
        <div
          id="alert-border-3"
          className="flex items-center p-4 mb-4 text-green-800 bg-green-50 dark:text-green-400 dark:bg-gray-800 dark:border-green-800"
          role="alert"
        >
          <div className="ms-3 text-sm font-medium">
            Success! Your account details have been updated.
          </div>
          <button
            type="button"
            className="ms-auto -mx-1.5 -my-1.5 bg-green-50 text-green-500 rounded-lg focus:ring-2 focus:ring-green-400 p-1.5 hover:bg-green-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-green-400 dark:hover:bg-gray-700"
            data-dismiss-target="#alert-border-3"
            aria-label="Close"
            onClick={() => setOpen(false)} // Set the alert to closed when the button is clicked
          >
            <span className="sr-only">Dismiss</span>
            <svg
              className="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
          </button>
        </div>
      )}
      {open && error && (
        <div
          id="alert-border-2"
          className="flex items-center p-4 mb-4 text-red-800 bg-red-50 dark:text-red-400 dark:bg-gray-800 dark:border-red-800"
          role="alert"
        >
          <div className="ms-3 text-sm font-medium">{state.message}</div>
          <button
            type="button"
            className="ms-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-gray-700"
            data-dismiss-target="#alert-border-2"
            aria-label="Close"
            onClick={() => setOpen(false)} // Set the alert to closed when the button is clicked
          >
            <span className="sr-only">Dismiss</span>
            <svg
              className="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
          </button>
        </div>
      )}
      <div className="container mx-auto py-12 px-4 md:px-6">
        <div className="flex items-center gap-4 mb-8">
          <Avatar className="h-16 w-16 rounded-full">
            <AvatarImage src={user.image} />
            <AvatarFallback>{user.alias}</AvatarFallback>
          </Avatar>
          <div className="grid gap-1">
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">{user.alias}</p>
          </div>
        </div>
        <form action={formAction}>
          <div className="grid gap-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Account Details</h2>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full md:w-96"
                  />
                  <input type="hidden" name="alias" value={username} />
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Communication Preferences
              </h2>
              <div className="space-y-4">
                <div className="items-top flex gap-2">
                  <Checkbox
                    id="receiveTippingReminders"
                    checked={tippingReminders}
                    onCheckedChange={setTippingReminders}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label
                      htmlFor="receiveTippingReminders"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Tipping Reminders
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receive email reminders for upcoming games to tip
                    </p>
                  </div>
                  <input
                    type="hidden"
                    name="receiveTippingReminders"
                    value={tippingReminders.toString()}
                  />
                </div>
                <div className="items-top flex gap-2">
                  <Checkbox
                    id="receiveTippingResults"
                    checked={resultsNotifications}
                    onCheckedChange={setResultsNotifications}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label
                      htmlFor="receiveTippingResults"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Round Results
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receive each round's tipping results to your email
                    </p>
                  </div>
                  <input
                    type="hidden"
                    name="receiveTippingResults"
                    value={resultsNotifications.toString()}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-8">
            <Button type="submit" className="ml-auto">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
