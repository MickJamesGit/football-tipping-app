import Link from "next/link";
import SiteLogo from "../components/site-logo";
import { AppBar, Toolbar } from "@mui/material";

export default function NotFound() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <AppBar position="fixed" className="bg-primary">
        <Toolbar className="flex justify-between">
          <div className="w-32 text-white">
            <SiteLogo />
          </div>
        </Toolbar>
      </AppBar>
      <div className="mx-auto max-w-md text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="mx-auto h-48 w-48 text-foreground"
        >
          <path
            fillRule="evenodd"
            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z"
            clipRule="evenodd"
          />
        </svg>
        <h1 className="mt-4 text-6xl font-bold tracking-tight text-foreground">
          404
        </h1>
        <p className="mt-4 text-2xl text-muted-foreground">
          Out of bounds! The content you're looking for is not here.
        </p>
        <div className="mt-6">
          <Link
            href="/"
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            prefetch={false}
          >
            Take me back to the game
          </Link>
        </div>
      </div>
    </div>
  );
}
