"use client";

import * as z from "zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { RegisterSchema } from "../../lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorMessage } from "@hookform/error-message";
import { signup } from "@/lib/auth";
import { Label } from "@/components/label";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { useRouter } from "next/navigation";
import Loader from "../dashboard/loader";

type SignUpProps = {};

export const SignUpForm = ({}: SignUpProps) => {
  const router = useRouter();
  const [error, setError] = useState<string | undefined>("");
  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true);

    startTransition(() => {
      signup(values).then((data) => {
        setIsLoading(false);
        if (data.success) {
          router.push("/signup/check-email");
        } else {
          setError(data.error);
        }
      });
    });
  };

  return (
    <div className="relative">
      {isLoading && <Loader />}
      <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-1">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Tony Lockett"
            {...register("name")}
            disabled={isPending}
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
            placeholder="plugger@swans.com"
            {...register("email")}
            disabled={isPending}
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
          <Input
            id="password"
            type="password"
            {...register("password")}
            disabled={isPending}
          />
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
        <div className="flex">
          <Button
            type="submit"
            color="primary"
            className="w-full mt-4"
            aria-disabled={isPending}
            disabled={isPending}
          >
            {isPending ? "Registering..." : "Sign up"}
          </Button>
        </div>
      </form>
    </div>
  );
};
