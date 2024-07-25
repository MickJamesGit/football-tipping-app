"use client";

import SiteLogo from "@/app/ui/site-logo";
import { googleAuthenticate } from "../lib/actions";
import {
  FacebookLoginButton,
  GoogleLoginButton,
  InstagramLoginButton,
  AppleLoginButton,
  XLoginButton,
} from "react-social-login-buttons";

export default function Page() {
  function handleClick() {
    alert("Thank you for using React Social Login Buttons!");
  }

  return (
    <main className="flex items-center justify-center md:h-screen bg-gray-100">
      <div className="relative mx-auto flex w-full max-w-md flex-col space-y-4 p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-center h-20 w-full rounded-lg bg-green-500 p-3 md:h-24">
          <div className="w-32 md:w-36 text-white">
            <SiteLogo />
          </div>
        </div>
        <div className="text-center mt-4">
          <p className="text-lg">Select a login option to continue</p>
        </div>
        <div className="border-t border-gray-300 my-4"></div>
        <div className="flex flex-col space-y-3">
          <FacebookLoginButton
            onClick={handleClick}
            className="!w-full !py-2 !text-sm"
          />
          <InstagramLoginButton
            onClick={handleClick}
            className="!w-full !py-2 !text-sm"
          />
          <GoogleLoginButton
            onClick={googleAuthenticate}
            className="!w-full !py-2 !text-sm"
          />
          <AppleLoginButton
            onClick={handleClick}
            className="!w-full !py-2 !text-sm"
          />
          <XLoginButton
            onClick={handleClick}
            className="!w-full !py-2 !text-sm"
          />
        </div>
      </div>
    </main>
  );
}
