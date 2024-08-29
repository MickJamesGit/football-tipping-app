"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/lib/schemas";
import { login } from "@/lib/auth";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { ErrorMessage } from "@hookform/error-message";
import { Label } from "@/components/label";
import Loader from "@/components/dashboard/loader";
import { EyeOff, Eye } from "lucide-react";

type Props = {};

export const LoginForm = ({}: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams.get("callbackUrl");
  const [error, setError] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");

    startTransition(() => {
      login(values, callbackUrl)
        .then((data) => {
          if (data?.error) {
            setError(data.error);
          }

          if (data?.success) {
            router.push("/dashboard");
          }
        })
        .catch(() => setError("Something went wrong"));
    });
  };

  return (
    <div className="relative">
      {isPending && <Loader />}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
        <div className="space-y-1">
          <Label htmlFor="Email" className="text-sm font-medium text-left">
            Email
          </Label>
          <Input
            id="Email"
            type="email"
            {...register("email")}
            className="border rounded-md p-2"
          />
          <ErrorMessage
            errors={errors}
            name="email"
            render={({ message }) => (
              <p className="text-red-500 text-sm text-left">{message}</p>
            )}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="Password" className="text-sm font-medium text-left">
            Password
          </Label>
          <div className="relative">
            {" "}
            {/* Ensure the container is relative */}
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
              <p className="text-red-500 text-sm text-left">{message}</p>
            )}
          />
        </div>
        {error && <p className="text-red-500 text-sm text-left">{error}</p>}
        <div className="flex">
          <Button
            type="submit"
            color="primary"
            className="w-full mt-2"
            aria-disabled={isPending}
            disabled={isPending}
          >
            {isPending ? "Logging in..." : "Log in"}
          </Button>
        </div>
      </form>
    </div>
  );
};
