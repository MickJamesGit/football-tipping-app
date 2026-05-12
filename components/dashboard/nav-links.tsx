"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import React, { useEffect } from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import HomeIcon from "@mui/icons-material/Home";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";

const mobileLinks = [
  { name: "Home", href: "/dashboard", icon: <HomeIcon /> },
  {
    name: "Tipping",
    href: "/dashboard/tipping",
    icon: <CheckCircleOutlinedIcon />,
  },
  {
    name: "Leaderboard",
    href: "/dashboard/leaderboard",
    icon: <LeaderboardIcon />,
  },
];

const links = [
  { name: "Home", href: "/dashboard", icon: HomeDashboardIcon },
  {
    name: "Tipping",
    href: "/dashboard/tipping",
    icon: CircleCheckIcon,
  },
  { name: "Leaderboard", href: "/dashboard/leaderboard", icon: TrophyIcon },
  { name: "Account", href: "/dashboard/account", icon: UserIcon },
];

export default function NavLinks() {
  const pathname = usePathname();
  const [value, setValue] = React.useState(-1);

  useEffect(() => {
    const currentPathIndex = mobileLinks.findIndex((link) => {
      if (link.href === "/dashboard/tipping") {
        // Match exactly "/dashboard/tipping" or any subpath like "/dashboard/tipping/..."
        return (
          pathname === link.href || pathname.startsWith("/dashboard/tipping/")
        );
      }
      // Handle other links normally
      return pathname === link.href;
    });

    setValue(currentPathIndex !== -1 ? currentPathIndex : -1);
  }, [pathname]);

  return (
    <>
      {/* Mobile view */}
      <div className="block md:hidden">
        <div className="fixed bottom-0 left-0 w-full bg-background border-t shadow-lg">
          <BottomNavigation
            showLabels
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
          >
            {mobileLinks.map((link, index) => (
              <BottomNavigationAction
                key={link.name}
                component={Link}
                href={link.href}
                label={link.name}
                icon={link.icon}
              />
            ))}
          </BottomNavigation>
        </div>
      </div>

      {/* Desktop view */}
      <div className="hidden md:flex md:flex-col md:gap-2">
        {links.map((link) => {
          const LinkIcon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={clsx(
                "flex items-center gap-2 rounded-md p-3 text-sm font-medium md:flex-none md:justify-start transition-colors",
                {
                  "bg-primary text-white": isActive,
                  "bg-gray-50 hover:bg-primary hover:text-white": !isActive,
                },
              )}
            >
              <LinkIcon
                className={clsx("w-6 h-6", {
                  "text-white": isActive,
                  "text-primary": !isActive,
                })}
              />
              <p className="hidden md:block">{link.name}</p>
            </Link>
          );
        })}
      </div>
    </>
  );
}

function CircleCheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function HomeDashboardIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function TrophyIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function UserIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
