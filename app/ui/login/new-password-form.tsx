"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { NewPasswordSchema } from "./../../lib/schemas";
import { ErrorMessage } from "@hookform/error-message";
import { newPassword } from "./../../lib/actions";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type NewPasswordFormProps = {};

export const NewPasswordForm = ({}: NewPasswordFormProps) => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      newPassword(values, token).then((data) => {
        if (data.success) {
          setSuccess(data?.success);
          router.push("/login");
        }
        setError(data?.error);
      });
    });
  };

  return (
    <>
      <h1 className="text-3xl font-bold text-center">New Password</h1>
      <p className="text-muted-foreground text-center">
        Enter your new password
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input {...register("password")} id="password" type="password" />
        <ErrorMessage
          errors={errors}
          name="password"
          render={({ message }) => (
            <p className="text-red-500 text-sm text-left w-full">{message}</p>
          )}
        />
        <Button color="primary" type="submit" className="w-full">
          Reset Password
        </Button>
        {error && (
          <p className="text-red-500 text-sm text-left w-full">{error}</p>
        )}
        {success && (
          <p className="text-green-500 text-sm text-left w-full">{success}</p>
        )}
      </form>
    </>
  );
};
