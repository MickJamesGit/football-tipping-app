"use client";

import {
  HomeIcon,
  StarIcon,
  TrophyIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: "Home", href: "/dashboard", icon: HomeIcon },
  {
    name: "Tipping",
    href: "/dashboard/tipping",
    icon: StarIcon,
  },
  { name: "Leaderboard", href: "/dashboard/leaderboard", icon: TrophyIcon },
  { name: "Help", href: "/dashboard/help", icon: InformationCircleIcon },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile view */}
      <div className="block md:hidden">
        <Paper
          sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
          elevation={3}
        >
          <BottomNavigation
            showLabels
            value={links.findIndex((link) => link.href === pathname)}
          >
            {links.map((link, index) => {
              const LinkIcon = link.icon;
              return (
                <BottomNavigationAction
                  sx={{ marginTop: 1 }}
                  key={link.name}
                  component={Link}
                  href={link.href}
                  label={link.name}
                  icon={<LinkIcon />}
                  value={index}
                />
              );
            })}
          </BottomNavigation>
        </Paper>
      </div>

      {/* Desktop view */}
      <div className="hidden md:block">
        {links.map((link) => {
          const LinkIcon = link.icon;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={clsx(
                "flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-green-100 hover:text-green-600 md:flex-none md:justify-start md:p-2 md:px-3",
                {
                  "bg-green-100 text-green-600": pathname === link.href,
                }
              )}
            >
              <LinkIcon className="w-6" />
              <p className="hidden md:block">{link.name}</p>
            </Link>
          );
        })}
      </div>
    </>
  );
}
