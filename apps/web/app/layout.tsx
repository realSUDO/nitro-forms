import type { Metadata } from "next";
import { DM_Sans, Space_Grotesk } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { GlobalProviders } from "~/providers/global";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NitroForms | Forms, but faster.",
  description: "Create, publish, and analyze dynamic forms from one community-native workspace.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${dmSans.variable} ${spaceGrotesk.variable} font-sans`}>
        <ClerkProvider
          appearance={{
            variables: {
              colorPrimary: "#5865f2",
              colorBackground: "#383a40",
              colorInputBackground: "#1e1f22",
              colorInputText: "#f2f3f5",
              colorText: "#f2f3f5",
              colorTextSecondary: "#949ba4",
              borderRadius: "0.5rem",
            },
          }}
        >
          <GlobalProviders>{children}</GlobalProviders>
        </ClerkProvider>
      </body>
    </html>
  );
}
