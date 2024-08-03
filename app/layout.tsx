import "@/app/ui/global.css";
import { inter } from "@/app/ui/fonts";
import { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { UserProvider } from "./context/user-context";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: {
    template: "%s | FootyTips Dashboard",
    default: "FootyTips Dashboard",
  },
  description: "The official FootyTips website.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        {" "}
        <SessionProvider>
          <Toaster />
          <UserProvider>{children}</UserProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
