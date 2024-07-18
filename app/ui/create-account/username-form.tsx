"use client";

import { setUsername } from "@/app/lib/actions";
import { States } from "../dashboard/tipping/table";
import { lusitana } from "../fonts";
import { useActionState, useEffect } from "react";
import { Button } from "../dashboard/button";
import {
  ArrowRightIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const initialState: States = { message: "", error: undefined };
  const [errorMessage, formAction, isPending] = useActionState(
    setUsername,
    initialState
  );

  useEffect(() => {
    if (errorMessage.error === false) {
      router.push("/dashboard");
    }
  }, [errorMessage, router]);

  return (
    <form action={formAction} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`${lusitana.className} mb-3 text-2xl`}>
          Please set a username to continue.
        </h1>
        <div className="w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="email"
            >
              Username
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="alias"
                type="text"
                name="alias"
                placeholder="Enter your username"
                required
                minLength={6}
                maxLength={25}
              />
            </div>
          </div>
        </div>
        <Button className="mt-4 w-full" aria-disabled={isPending}>
          Confirm <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Button>

        <div className="flex h-8 items-end space-x-1">
          {errorMessage.error && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{errorMessage.error}</p>
            </>
          )}
        </div>
      </div>
    </form>
  );
}
