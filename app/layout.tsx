import "@/styles/global.css";
import { Metadata } from "next";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { Toaster } from "@/components/toaster";
import { inter } from "@/public/fonts/fonts";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: {
    template: "%s | SportsTippers Dashboard",
    default: "SportsTippers Dashboard",
  },
  description: "The official SportsTippers website.",
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
        <SpeedInsights />
      </body>
    </html>
  );
}
