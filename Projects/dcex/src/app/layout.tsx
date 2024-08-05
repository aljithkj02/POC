import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppBar } from "@/components/AppBar";
import { ProvidersProps } from "./Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ProvidersProps>
          <div className="bg-[#F2F8FC] h-screen select-none">
            <AppBar />
            {children}
          </div>
        </ProvidersProps>
      </body>
    </html>
  );
}
