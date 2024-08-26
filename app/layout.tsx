import "@/styles/global.css";
import { Metadata } from "next";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { Toaster } from "@/components/toaster";
import { inter } from "@/public/fonts/fonts";

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
        <Toaster />
        {children}
      </body>
    </html>
  );
}
