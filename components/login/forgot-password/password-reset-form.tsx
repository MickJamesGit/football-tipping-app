"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetSchema } from "@/lib/schemas";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { ErrorMessage } from "@hookform/error-message";
import { resetPassword } from "@/lib/auth";
import Loader from "@/components/dashboard/loader";

type PasswordResetFormProps = {};

export const PasswordResetForm = ({}: PasswordResetFormProps) => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: z.infer<typeof ResetSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      resetPassword(values).then((data) => {
        setError(data?.error);
        setSuccess(data?.success);
      });
    });
  };

  return (
    <div className="relative">
      {isPending && <Loader />}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input {...register("email")} id="email" type="email" />
        <ErrorMessage
          errors={errors}
          name="email"
          render={({ message }) => (
            <p className="text-red-500 text-sm text-left w-full">{message}</p>
          )}
        />
        <Button
          color="primary"
          type="submit"
          className="w-full"
          aria-disabled={isPending}
          disabled={isPending}
        >
          {isPending ? "Loading..." : "Reset Password"}
        </Button>
        {error && (
          <p className="text-red-500 text-sm text-left w-full">{error}</p>
        )}
        {success && (
          <p className="text-green-500 text-sm text-left w-full">{success}</p>
        )}
      </form>
    </div>
  );
};
