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
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${dmSans.variable} ${spaceGrotesk.variable} font-sans`} suppressHydrationWarning>
        <ClerkProvider
          appearance={{
            variables: {
              colorPrimary: "#5865f2",
              colorBackground: "#313338",
              colorInputBackground: "#1e1f22",
              colorInputText: "#f2f3f5",
              colorText: "#f2f3f5",
              colorTextSecondary: "#949ba4",
              colorTextOnPrimaryBackground: "#ffffff",
              colorDanger: "#ed4245",
              colorSuccess: "#3ba55c",
              colorNeutral: "#f2f3f5",
              borderRadius: "0.5rem",
              colorShimmer: "#2b2d31",
            },
            elements: {
              card: "bg-[#383a40] border-none shadow-none",
              headerTitle: "text-[#f2f3f5]",
              headerSubtitle: "text-[#949ba4]",
              socialButtonsBlockButton: "bg-[#2b2d31] border-[#3f4147] text-[#f2f3f5] hover:bg-[#3f4147]",
              formFieldLabel: "text-[#b5bac1]",
              formFieldInput: "bg-[#1e1f22] border-[#3f4147] text-[#f2f3f5]",
              footerActionLink: "text-[#5865f2]",
              dividerLine: "bg-[#3f4147]",
              dividerText: "text-[#949ba4]",
              formButtonPrimary: "bg-[#5865f2] hover:bg-[#4752c4]",
              identityPreview: "bg-[#2b2d31] border-[#3f4147]",
              identityPreviewText: "text-[#f2f3f5]",
              identityPreviewEditButton: "text-[#5865f2]",
              alert: "bg-[#2b2d31] border-[#3f4147] text-[#f2f3f5]",
              alertText: "text-[#f2f3f5]",
            },
          }}
        >
          <GlobalProviders>{children}</GlobalProviders>
        </ClerkProvider>
      </body>
    </html>
  );
}
