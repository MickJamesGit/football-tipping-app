import "@/app/ui/global.css";
import { inter } from "@/app/ui/fonts";
import { Metadata } from "next";
import UserProviderWrapper from "@/app/userproviderwrapper"; // Adjust the import path as necessary

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
        <UserProviderWrapper>{children}</UserProviderWrapper>
      </body>
    </html>
  );
}
