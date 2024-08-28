"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/avatar";
import { Label } from "@/components/label";
import { Input } from "@/components/input";
import { Checkbox } from "@/components/checkbox";
import { Button } from "@/components/button";
import { Metadata } from "next";
import { useState, useTransition } from "react";
import { type AccountDetails } from "@/types/definitions";
import { updateAccountDetails } from "@/lib/user";
import PageHeading from "@/components/dashboard/page-heading";
import { accountDetailsSchema } from "@/lib/schemas";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/use-toast";
import { ErrorMessage } from "@hookform/error-message";

export const metadata: Metadata = {
  title: "Account",
};

export default function AccountDetails({ user }: { user: AccountDetails }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");

  const [username, setAccountDetails] = useState(user.alias);
  const [tippingReminders, setTippingReminders] = useState(
    user.receiveTippingReminders
  );
  const [resultsNotifications, setResultsNotifications] = useState(
    user.receiveTippingResults
  );

  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof accountDetailsSchema>>({
    resolver: zodResolver(accountDetailsSchema),
    defaultValues: {
      username: user.alias || "",
      receiveTippingResults: user.receiveTippingResults,
      receiveTippingReminders: user.receiveTippingReminders,
    },
  });

  const onSubmit = (values: z.infer<typeof accountDetailsSchema>) => {
    setError("");
    startTransition(() => {
      updateAccountDetails(values).then((data) => {
        if (data?.message) {
          setError(data.message);
        } else {
          toast({
            title: "Success",
            duration: 3000,
            description: "Account details updated.",
            variant: "default",
            className: "bg-green-500 text-white border-none",
            style: { zIndex: 500 },
          });
        }
      });
    });
  };

  const handleTippingRemindersChange = (value: boolean) => {
    setTippingReminders(value);
    setValue("receiveTippingReminders", value);
  };

  const handleResultsNotificationsChange = (value: boolean) => {
    setResultsNotifications(value);
    setValue("receiveTippingResults", value);
  };

  return (
    <>
      <PageHeading title="My Account" />
      {error && <p className="text-red-500 text-sm text-left">{error}</p>}
      <div className="container mx-auto py-2 px-4 md:px-6">
        <div className="flex items-center gap-4 mb-8">
          <Avatar className="h-16 w-16 rounded-full">
            {user.image && <AvatarImage src={user.image} />}
            <AvatarFallback className="bg-emerald-500 text-white ">
              {(user.alias || "User")
                .split(" ")
                .map((word: string) => word[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="grid gap-1">
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Account Details</h2>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={username ?? ""}
                    {...register("username")}
                    onChange={(e) => setAccountDetails(e.target.value)}
                    className="w-full md:w-96"
                  />
                  <ErrorMessage
                    errors={errors}
                    name="username"
                    render={({ message }) => (
                      <p className="text-red-500 text-sm text-left">
                        {message}
                      </p>
                    )}
                  />
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
                    {...register("receiveTippingReminders")}
                    checked={tippingReminders}
                    onCheckedChange={handleTippingRemindersChange}
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
                </div>
                <div className="items-top flex gap-2">
                  <Checkbox
                    id="receiveTippingResults"
                    {...register("receiveTippingResults")}
                    checked={resultsNotifications}
                    onCheckedChange={handleResultsNotificationsChange}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label
                      htmlFor="receiveTippingResults"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Round Results
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receive each round&#39;s tipping results to your email
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-8">
            <Button
              type="submit"
              className="ml-auto"
              aria-disabled={pending}
              disabled={pending}
            >
              {pending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
