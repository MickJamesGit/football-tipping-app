"use client";

import { Button } from "./button";
import { facebookAuthenticate } from "@/lib/auth";
import Image from "next/image";

const FacebookLoginButton: React.FC = () => {
  return (
    <form action={facebookAuthenticate}>
      <Button
        variant="outline"
        className="w-full bg-[#1877F2] text-white flex items-center justify-center space-x-2 py-2"
      >
        <Image
          src="/images/facebook-logo.png"
          alt="Facebook"
          width={20}
          height={20}
        />
        <span>Continue with Facebook</span>
      </Button>
    </form>
  );
};

export default FacebookLoginButton;
