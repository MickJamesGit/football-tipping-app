"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/avatar";
import { Input } from "@/components/input";
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Account",
};

export default function AccountDetails({ user }: { user: AccountDetails }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");

  const { toast } = useToast();

  const form = useForm<z.infer<typeof accountDetailsSchema>>({
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

  return (
    <>
      {error && <p className="text-red-500 text-sm text-left">{error}</p>}{" "}
      <div className="container mx-auto py-4 pb-4 mb-6 bg-slate-50 rounded-lg px-4 md:px-6">
        <PageHeading
          title="My Account"
          description="Update your username or adjust your communication preferences."
        />
        <div className="bg-white p-6 rounded-lg mb-6 shadow-sm">
          {" "}
          {/* Added a new div with white background to create the gap */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-6">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem className="flex flex-col justify-between rounded-lg max-w-2xl space-y-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base font-medium">
                            Username
                          </FormLabel>
                          <FormDescription>
                            This is your public display name.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div>
                    <h2 className="text-lg font-medium mb-2">
                      Communication Preferences
                    </h2>
                  </div>
                  <FormField
                    control={form.control}
                    name="receiveTippingReminders"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between max-w-2xl rounded-lg border bg-white p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-sm">
                            Tipping Reminders
                          </FormLabel>
                          <FormDescription>
                            Receive email reminders to submit your tips before
                            each round.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="receiveTippingResults"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between max-w-2xl rounded-lg bg-white border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-sm">
                            Tipping Results
                          </FormLabel>
                          <FormDescription>
                            Get the latest round results delivered straight to
                            your email.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="flex justify-end mt-6">
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
          </Form>
        </div>
      </div>
    </>
  );
}
