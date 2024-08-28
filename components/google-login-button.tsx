"use client";

import { Button } from "./button";
import { googleAuthenticate } from "@/lib/auth";
import Image from "next/image";

const GoogleLoginButton: React.FC = () => {
  return (
    <form action={googleAuthenticate}>
      <Button
        variant="outline"
        type="submit"
        className="w-full bg-white border-gray-300 text-gray-900 flex items-center justify-center space-x-2 py-2"
      >
        <Image src="images/google-logo.png" alt="Google" className="h-5 w-5" />
        <span>Continue with Google</span>
      </Button>
    </form>
  );
};

export default GoogleLoginButton;
