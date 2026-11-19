import type { Metadata, Viewport } from "next";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "FixMate — Repairs, without the blind spots", template: "%s | FixMate" },
  description: "Find trusted device and home appliance repair professionals. Follow every repair step and pay only after the work is complete.",
  applicationName: "FixMate",
  icons: { icon: "/images/repair-placeholder.svg" },
  openGraph: { title: "FixMate — Repairs, without the blind spots", description: "Clear repair requests, verified professionals and pay-after-service checkout.", type: "website" }
};
export const viewport: Viewport = { themeColor: "#101c1c", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning><body><Providers>{children}</Providers></body></html>;
}
