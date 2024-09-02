"use client";

import React from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { type AccountDetails } from "@/types/definitions";
import Link from "next/link";
import { signOut } from "next-auth/react";

interface UserAccountSheetProps {
  user: AccountDetails;
}

const UserAccountSheet: React.FC<UserAccountSheetProps> = ({ user }) => {
  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="z-500">
      <Sheet>
        <SheetTrigger>
          <UserAccountIcon />
        </SheetTrigger>

        <SheetContent className="w-[250px]">
          <SheetHeader className="flex flex-col items-center space-y-4">
            {user.alias && (
              <>
                <SheetDescription>
                  <Avatar className="h-[100px] w-[100px] rounded-full">
                    {user.image && <AvatarImage src={user.image} />}
                    <AvatarFallback className="bg-emerald-500 text-white flex items-center justify-center h-full w-full text-2xl">
                      {user.alias
                        .split(" ")
                        .map((word) => word[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </SheetDescription>
                <SheetTitle>{user.alias}</SheetTitle>
              </>
            )}
          </SheetHeader>
          <div>
            <Separator className="my-4 bg-gray-300 h-px" />

            <div className="flex flex-col gap-2">
              <Link href="/dashboard/account" prefetch={false}>
                <SheetClose>
                  <div className="flex items-center text-base w-full font-semibold text-gray-800 px-2 py-2 rounded-md hover:bg-gray-100 cursor-pointer flex-1">
                    <svg
                      className="h-6 w-6 mr-3 text-gray-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {/* Profile/Account Icon */}
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
                    </svg>
                    <Label className="cursor-pointer text-left">
                      Account Details
                    </Label>
                  </div>
                </SheetClose>
              </Link>
              <Link href="/dashboard/account" prefetch={false}>
                <SheetClose>
                  <div className="flex items-center text-base w-full font-semibold text-gray-800 px-2 py-2 rounded-md hover:bg-gray-100 cursor-pointer">
                    <svg
                      className="h-6 w-6 mr-3 text-gray-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {/* Mail/Envelope Icon */}
                      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"></path>
                    </svg>
                    <Label className="cursor-pointer flex-1 text-left">
                      Communication Preferences
                    </Label>
                  </div>
                </SheetClose>
              </Link>
            </div>

            <Separator className="my-4 bg-gray-300 h-px" />
          </div>

          <SheetFooter>
            <SheetClose asChild>
              <Button
                type="submit"
                className="w-full mt-3"
                onClick={handleSignOut}
              >
                Log out
              </Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default UserAccountSheet;

const UserAccountIcon = () => {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ cursor: "pointer" }}
    >
      <circle
        cx="16"
        cy="16"
        r="15"
        stroke="white"
        strokeWidth="2"
        fill="none"
      />
      <circle
        cx="16"
        cy="12"
        r="4"
        stroke="white"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M8 25C8 20.5 12 18 16 18C20 18 24 20.5 24 25"
        stroke="white"
        strokeWidth="2"
        fill="none"
      />
    </svg>
  );
};
