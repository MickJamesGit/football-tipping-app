"use client";

import { Button } from "./button";
import { facebookAuthenticate } from "@/lib/auth";

const FacebookLoginButton: React.FC = () => {
  return (
    <form action={facebookAuthenticate}>
      <Button
        variant="outline"
        className="w-full bg-[#1877F2] text-white flex items-center justify-center space-x-2 py-2"
      >
        <img
          src="/images/facebook-logo.png"
          alt="Facebook"
          className="h-5 w-5"
        />
        <span>Continue with Facebook</span>
      </Button>
    </form>
  );
};

export default FacebookLoginButton;
