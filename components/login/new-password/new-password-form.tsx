"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { NewPasswordSchema } from "@/lib/schemas";
import { ErrorMessage } from "@hookform/error-message";
import { newPassword } from "@/lib/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import Loader from "@/components/dashboard/loader";
import { Eye, EyeOff } from "lucide-react";
import { useToast } from "@/components/use-toast";

type NewPasswordFormProps = {};

export const NewPasswordForm = ({}: NewPasswordFormProps) => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };
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
          toast({
            title: "Success",
            duration: 3000,
            description: "Your password has been updated.",
            variant: "default",
            className: "bg-green-500 text-white border-none",
            style: { zIndex: 500 },
          });
          router.push("/login");
        }
        setError(data?.error);
      });
    });
  };

  return (
    <div className="relative space-y-2">
      {isPending && <Loader />}
      <h1 className="text-3xl font-bold text-center">New Password</h1>
      <p className="text-muted-foreground text-center">
        Enter your new password
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            {...register("password")}
            className="border rounded-md p-2 pr-10 w-full"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5 text-gray-500" />
            ) : (
              <Eye className="w-5 h-5 text-gray-500" />
            )}
          </button>
        </div>
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
    </div>
  );
};
