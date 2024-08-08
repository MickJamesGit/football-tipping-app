"use client";

import * as z from "zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { RegisterSchema } from "./../../lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorMessage } from "@hookform/error-message";
import { signup } from "./../../lib/actions";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type SignUpProps = {};

export const SignUpForm = ({}: SignUpProps) => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      signup(values).then((data) => {
        setError(data.error);
        setSuccess(data.success);
      });
    });
  };

  return (
    <form className=" flex flex-col" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-1">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          type="text"
          placeholder="John Doe"
          {...register("name")}
        />
      </div>
      <ErrorMessage
        errors={errors}
        name="name"
        render={({ message }) => (
          <p className="text-red-500 text-sm text-left w-full mt-1">
            {message}
          </p>
        )}
      />
      <div className="space-y-1 mt-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="m@example.com"
          {...register("email")}
        />
      </div>
      <ErrorMessage
        errors={errors}
        name="email"
        render={({ message }) => (
          <p className="text-red-500 text-sm text-left w-full mt-1">
            {message}
          </p>
        )}
      />
      <div className="space-y-1 mt-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" {...register("password")} />
      </div>
      <ErrorMessage
        errors={errors}
        name="password"
        render={({ message }) => (
          <p className="text-red-500 text-sm text-left w-full mt-1">
            {message}
          </p>
        )}
      />
      {error && (
        <p className="text-red-500 text-sm text-left w-full">{error}</p>
      )}
      {success && (
        <p className="text-green-500 text-sm text-left w-full">{success}</p>
      )}
      <div className="flex">
        <Button type="submit" color="primary" className="w-full mt-4">
          Sign up
        </Button>
      </div>
    </form>
  );
};
