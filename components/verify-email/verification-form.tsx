"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { verifyEmail } from "@/lib/auth";

type VerificationFormProps = {};

export const VerificationForm = ({}: VerificationFormProps) => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const onSubmit = useCallback(() => {
    if (success || error) return;

    if (!token) {
      setError("Missing token!");
      return;
    }

    verifyEmail(token)
      .then((data) => {
        if (data.success) {
          setSuccess("Email verified. Redirecting you to login page...");
          setTimeout(() => {
            router.push("/login");
          }, 3000);
        }
        setError(data.error);
      })
      .catch(() => {
        setError("Something went wrong!");
      });
  }, [token, success, error]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <>
      <div className="pt-10">
        {!success && !error && (
          <>
            <h1 className="text-lg font-bold text-center">
              Verifying your email...
            </h1>
          </>
        )}
        {success && <p className=" text-lg font-bold text-center">{success}</p>}
        {error && <p className="text-lg font-bold text-center">{error}</p>}
      </div>
    </>
  );
};
