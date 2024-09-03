"use client";

import React, { useState, useTransition } from "react";
import { Button } from "@/components/button";
import Loader from "../dashboard/loader";
import { setAccountDetails } from "@/lib/user";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { accountRegistrationDetailsSchema } from "@/lib/schemas";
import { Switch } from "../ui/switch";
import { Input } from "../input";
import { z } from "zod";
import { useToast } from "../use-toast";
import { Checkbox } from "../checkbox";

interface RegistrationFormProps {
  activeSports: string[];
}

const initialState = {
  message: "",
};

const RegistrationForm: React.FC<RegistrationFormProps> = ({
  activeSports,
}) => {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");

  const { toast } = useToast();

  const form = useForm<z.infer<typeof accountRegistrationDetailsSchema>>({
    resolver: zodResolver(accountRegistrationDetailsSchema),
    defaultValues: {
      username: "",
      receiveTippingResults: false,
      receiveTippingReminders: false,
    },
  });

  const onSubmit = (
    values: z.infer<typeof accountRegistrationDetailsSchema>
  ) => {
    setError("");
    startTransition(() => {
      setAccountDetails(values).then((data) => {
        if (data?.message) {
          setError(data.message);
        } else {
        }
      });
    });
  };

  return (
    <div className="relative space-y-2">
      {pending && <Loader />}
      <h1 className="text-3xl font-bold text-center mt-4 mb-4">
        Let&#39;s set up your account
      </h1>

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
              <FormField
                control={form.control}
                name="sports"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">Sports</FormLabel>
                      <FormDescription>
                        Select the sports you want to register for.
                      </FormDescription>
                    </div>
                    {activeSports.map((sport) => (
                      <FormField
                        key={sport}
                        control={form.control}
                        name="sports"
                        render={({ field }) => {
                          const currentValue = Array.isArray(field.value)
                            ? field.value
                            : []; // Ensure it's an array

                          return (
                            <FormItem
                              key={sport}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={currentValue.includes(sport)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...currentValue, sport])
                                      : field.onChange(
                                          currentValue.filter(
                                            (value) => value !== sport
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {sport}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
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
                  <FormItem className="flex flex-row items-center justify-between max-w-2xl  bg-white ">
                    <div className="space-y-0.5">
                      <FormLabel className="text-sm">
                        Tipping Reminders
                      </FormLabel>
                      <FormDescription>
                        Receive email reminders to submit your tips before each
                        round.
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
                  <FormItem className="flex flex-row items-center justify-between max-w-2xl  bg-white  ">
                    <div className="space-y-0.5">
                      <FormLabel className="text-sm">Tipping Results</FormLabel>
                      <FormDescription>
                        Get the latest round results delivered straight to your
                        email.
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
              {pending ? "Creating account..." : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default RegistrationForm;
